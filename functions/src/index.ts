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

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.pass,
  },
});

/**
 * @param {import('firebase-functions').firestore.QueryDocumentSnapshot} snap
 * @param {import('firebase-functions').EventContext} context
 */
export const sendContactEmail = functions.firestore
  .document("contactos/{contactId}")
  .onCreate(async (snap: QueryDocumentSnapshot, context) => {
    const data = snap.data();
    const mailOptions = {
      from: functions.config().gmail.email, // Remitente
      to: functions.config().contact?.email || functions.config().gmail.email, // Destinatarios
      subject: "Nuevo contacto desde la web",
      text: `
        Nombre: ${data?.nombre || data?.name}
        Email: ${data?.email || ""}
        Teléfono: ${data?.telefono || data?.phone || ""}
        Mensaje: ${data?.mensaje || data?.message || ""}
        ${data?.tipoReforma ? `Tipo de reforma: ${data.tipoReforma}` : ""}
        ${data?.presupuesto ? `Presupuesto: ${data.presupuesto}` : ""}
        Fecha: ${
          data?.fecha
            ? data.fecha.toDate
              ? data.fecha.toDate().toLocaleString()
              : data.fecha
            : ""
        }
        UserAgent: ${data?.userAgent || ""}
      `,
      html: `
        <h2>Nuevo contacto desde la web</h2>
        <p><strong>Nombre:</strong> ${data?.nombre || data?.name}</p>
        <p><strong>Email:</strong> ${data?.email || ""}</p>
        <p><strong>Teléfono:</strong> ${data?.telefono || data?.phone || ""}</p>
        <p><strong>Mensaje:</strong> ${data?.mensaje || data?.message || ""}</p>
        ${
          data?.tipoReforma
            ? `<p><strong>Tipo de reforma:</strong> ${data.tipoReforma}</p>`
            : ""
        }
        ${
          data?.presupuesto
            ? `<p><strong>Presupuesto:</strong> ${data.presupuesto}</p>`
            : ""
        }
        <p><strong>Fecha:</strong> ${
          data?.fecha
            ? data.fecha.toDate
              ? data.fecha.toDate().toLocaleString()
              : data.fecha
            : ""
        }</p>
        <p><strong>UserAgent:</strong> ${data?.userAgent || ""}</p>
      `,
    };
    await transporter.sendMail(mailOptions);
    return null;
  });

export const sendCallbackEmail = functions.firestore
  .document("callbacks/{callbackId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const mailOptions = {
      from: functions.config().gmail.email,
      to:
        functions.config().contact?.callback_to ||
        functions.config().contact?.email ||
        functions.config().gmail.email,
      subject: "Nuevo callback desde la web",
      text: `
        Nombre: ${data?.nombre || data?.name}
        Teléfono: ${data?.telefono || data?.phone || ""}
        Mensaje: ${data?.mensaje || data?.message || ""}
        Fecha: ${
          data?.fecha
            ? data.fecha.toDate
              ? data.fecha.toDate().toLocaleString()
              : data.fecha
            : ""
        }
        UserAgent: ${data?.userAgent || ""}
      `,
      html: `
        <h2>Nuevo callback desde la web</h2>
        <p><strong>Nombre:</strong> ${data?.nombre || data?.name}</p>
        <p><strong>Teléfono:</strong> ${data?.telefono || data?.phone || ""}</p>
        <p><strong>Mensaje:</strong> ${data?.mensaje || data?.message || ""}</p>
        <p><strong>Fecha:</strong> ${
          data?.fecha
            ? data.fecha.toDate
              ? data.fecha.toDate().toLocaleString()
              : data.fecha
            : ""
        }</p>
        <p><strong>UserAgent:</strong> ${data?.userAgent || ""}</p>
      `,
    };
    await transporter.sendMail(mailOptions);
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
      tipoReforma,
      presupuesto,
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
        tipoReforma: tipoReforma || "",
        presupuesto: presupuesto || "",
        mensaje: mensaje.trim(),
        fecha: admin.firestore.Timestamp.now(),
        status: "nuevo",
        userAgent: userAgent || "",
      });

    res.status(200).json({ success: true });
    return;
  }
);
