/**
 * Función preparada para enviar un email con los datos de un lead (formulario o callback).
 * Esta función está pensada para usarse en una Cloud Function de Firebase o backend Node.js.
 * Puedes adaptarla para SendGrid, Mailgun, Nodemailer, etc.
 *
 * Ejemplo de uso en Cloud Function:
 *   exports.sendLeadEmail = functions.firestore.document('contactos/{docId}').onCreate((snap, context) => {
 *     const lead = snap.data();
 *     return sendLeadEmail(lead);
 *   });
 */

// Ejemplo con SendGrid
// npm install @sendgrid/mail
// import sgMail from '@sendgrid/mail';
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

import nodemailer from "nodemailer";

export async function sendLeadEmail(lead: {
  nombre?: string;
  email?: string;
  telefono?: string;
  tipoReforma?: string;
  presupuesto?: string;
  mensaje?: string;
  name?: string;
  phone?: string;
  message?: string;
  fecha?: any;
  status?: string;
  userAgent?: string;
}) {
  // Configura el transporter con SMTP de IONOS
  const transporter = nodemailer.createTransport({
    host: "smtp.ionos.es", // Cambia si tu proveedor usa otro host
    port: 465, // 465 para SSL, 587 para TLS
    secure: true, // true para 465, false para 587
    auth: {
      user: process.env.IONOS_USER || "info@autohaus.es", // Mejor usar variables de entorno
      pass: process.env.IONOS_PASS || "TU_CONTRASEÑA", // Mejor usar variables de entorno
    },
  });

  const subject = lead.tipoReforma
    ? `Nuevo lead de contacto: ${lead.nombre}`
    : `Nuevo lead de callback: ${lead.name}`;
  const to = "info@autohaus.es";
  const from = process.env.IONOS_USER || "info@autohaus.es";
  const text = `
    Nombre: ${lead.nombre || lead.name}
    Email: ${lead.email || "-"}
    Teléfono: ${lead.telefono || lead.phone || "-"}
    Tipo de reforma: ${lead.tipoReforma || "-"}
    Presupuesto: ${lead.presupuesto || "-"}
    Mensaje: ${lead.mensaje || lead.message || "-"}
    Fecha: ${lead.fecha}
    User-Agent: ${lead.userAgent || "-"}
  `;

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
  });

  // Ejemplo con SendGrid (descomentar y configurar en Cloud Function)
  // await sgMail.send({
  //   to,
  //   from,
  //   subject,
  //   text,
  // });

  // Si usas otro servicio, implementa aquí
  // Por ahora solo loguea para pruebas
  console.log("Lead recibido, email preparado:", { to, subject, text });
}
