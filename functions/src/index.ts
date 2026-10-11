/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import nodemailer from "nodemailer";
import { QueryDocumentSnapshot } from "firebase-functions/v1/firestore";
import { defineSecret, defineString } from "firebase-functions/params";
import {
  renderContactEmail,
  renderCallbackEmail,
  isValidContact,
  isValidCallback,
} from "./lib/email";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.

admin.initializeApp();

// Configuracion migrada a params con fallback a Runtime Config (obsoleto).
// El usuario debe fijar: firebase functions:secrets:set GMAIL_PASS
// y GMAIL_EMAIL / CONTACT_EMAIL via `firebase functions:config` nuevo o .env.
// Mientras tanto, si los params estan vacios se usa functions.config().
const GMAIL_EMAIL = defineString("GMAIL_EMAIL", { default: "" });
const GMAIL_PASS = defineSecret("GMAIL_PASS");
const CONTACT_EMAIL = defineString("CONTACT_EMAIL", { default: "" });
const CALLBACK_EMAIL = defineString("CALLBACK_EMAIL", { default: "" });

function legacyConfig(): any {
  try {
    return functions.config();
  } catch {
    return {};
  }
}

function getMailUser(): string {
  return GMAIL_EMAIL.value() || legacyConfig().gmail?.email || "";
}

function getMailPass(): string {
  try {
    const v = GMAIL_PASS.value();
    if (v) return v;
  } catch {
    // secreto no fijado: fallback legacy
  }
  return legacyConfig().gmail?.pass || "";
}

function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: getMailUser(), pass: getMailPass() },
  });
}

/**
 * @param {import('firebase-functions').firestore.QueryDocumentSnapshot} snap
 * @param {import('firebase-functions').EventContext} context
 */
export const sendContactEmail = functions.firestore
  .document("contactos/{contactId}")
  .onCreate(async (snap: QueryDocumentSnapshot, context) => {
    const data = snap.data();

    // Validar y recortar antes de enviar; descartar spam/documentos malformados
    if (!isValidContact(data)) {
      console.warn("contactos: documento invalido, se descarta sin enviar email.");
      return null;
    }

    // Obtener email de destino desde Firestore
    let toEmail = getMailUser(); // Fallback
    try {
      const settingsDoc = await admin.firestore().doc("settings/site").get();
      if (settingsDoc.exists) {
        const settings = settingsDoc.data();
        toEmail =
          settings?.emails?.contactEmail ||
          CONTACT_EMAIL.value() ||
          legacyConfig().contact?.email ||
          getMailUser();
      }
    } catch (error) {
      console.error("Error obteniendo configuración de emails:", error);
    }

    const rendered = renderContactEmail(data);
    const mailOptions = {
      from: getMailUser(),
      to: toEmail,
      subject: rendered.subject,
      text: rendered.text,
      html: rendered.html,
    };
    await getTransporter().sendMail(mailOptions);
    return null;
  });

export const sendCallbackEmail = functions.firestore
  .document("callbacks/{callbackId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();

    if (!isValidCallback(data)) {
      console.warn("callbacks: documento invalido, se descarta sin enviar email.");
      return null;
    }

    // Obtener email de destino desde Firestore
    let toEmail = getMailUser(); // Fallback
    try {
      const settingsDoc = await admin.firestore().doc("settings/site").get();
      if (settingsDoc.exists) {
        const settings = settingsDoc.data();
        toEmail =
          settings?.emails?.callbackEmail ||
          CALLBACK_EMAIL.value() ||
          CONTACT_EMAIL.value() ||
          legacyConfig().contact?.callback_to ||
          legacyConfig().contact?.email ||
          getMailUser();
      }
    } catch (error) {
      console.error("Error obteniendo configuración de emails:", error);
    }

    const rendered = renderCallbackEmail(data);
    const mailOptions = {
      from: getMailUser(),
      to: toEmail,
      subject: rendered.subject,
      text: rendered.text,
      html: rendered.html,
    };
    await getTransporter().sendMail(mailOptions);
    return null;
  });

// Nueva función HTTP para recibir el formulario de contacto con rate limiting
export const contactFormHandler = functions.https.onRequest(
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Método no permitido" });
      return;
    }

    // 1. Obtener la IP del usuario
    const ip =
      req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
      req.connection.remoteAddress ||
      "unknown";

    // 2. Comprobar cuántos envíos ha hecho en los últimos 10 minutos
    const now = Date.now();
    const tenMinutesAgo = now - 10 * 60 * 1000;

    const enviosRef = admin.firestore().collection("contacto_envios");
    const snapshot = await enviosRef
      .where("ip", "==", ip)
      .where("timestamp", ">", tenMinutesAgo)
      .get();

    if (snapshot.size >= 3) {
      res.status(429).json({
        error:
          "Has enviado demasiadas solicitudes en poco tiempo. Por favor, espera unos minutos antes de volver a intentarlo.",
      });
      return;
    }

    // 3. Registrar el nuevo envío (rate limit)
    await enviosRef.add({
      ip,
      timestamp: now,
    });

    // 4. Validar y guardar el contacto real
    const {
      nombre,
      email,
      telefono,
      mensaje,
      userAgent,
      website, // honeypot
    } = req.body;

    // Honeypot: si el campo oculto está relleno, es spam
    if (website) {
      res.status(200).json({ success: true }); // Ignora el envío
      return;
    }

    // Validaciones básicas
    if (!nombre || !email || !telefono || !mensaje) {
      res.status(400).json({ error: "Faltan campos obligatorios" });
      return;
    }

    await admin
      .firestore()
      .collection("contactos")
      .add({
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        telefono: telefono.trim(),
        mensaje: mensaje.trim(),
        fecha: admin.firestore.Timestamp.now(),
        status: "nuevo",
        userAgent: userAgent || "",
      });

    res.status(200).json({ success: true });
    return;
  }
);
