import { escapeHtml, clip } from "./escapeHtml";

export interface ContactData {
  nombre?: unknown;
  name?: unknown;
  email?: unknown;
  telefono?: unknown;
  phone?: unknown;
  mensaje?: unknown;
  message?: unknown;
  fecha?: unknown;
  userAgent?: unknown;
}

export interface CallbackData {
  nombre?: unknown;
  name?: unknown;
  telefono?: unknown;
  phone?: unknown;
  mensaje?: unknown;
  message?: unknown;
  fecha?: unknown;
  userAgent?: unknown;
}

export interface RenderedEmail {
  subject: string;
  text: string;
  html: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fechaTexto(fecha: unknown): string {
  if (fecha == null) return "";
  const f = fecha as { toDate?: () => Date };
  try {
    if (typeof f.toDate === "function") return String(f.toDate().toLocaleString());
  } catch {
    return "";
  }
  return clip(fecha, 100);
}

/** Valida longitud y formato antes de enviar; false = descartar documento. */
export function isValidContact(d: ContactData): boolean {
  const nombre = clip(d.nombre ?? d.name ?? "", 200);
  const email = clip(d.email ?? "", 320);
  const telefono = clip(d.telefono ?? d.phone ?? "", 40);
  const mensaje = clip(d.mensaje ?? d.message ?? "", 10000);
  if (nombre.trim().length < 2 || nombre.length > 120) return false;
  if (!EMAIL_RE.test(email.trim())) return false;
  if (!/^[0-9\s\-+]{7,30}$/.test(telefono.trim())) return false;
  if (mensaje.trim().length === 0 || mensaje.length > 5000) return false;
  return true;
}

export function isValidCallback(d: CallbackData): boolean {
  const nombre = clip(d.nombre ?? d.name ?? "", 200);
  const telefono = clip(d.telefono ?? d.phone ?? "", 40);
  const mensaje = clip(d.mensaje ?? d.message ?? "", 10000);
  if (nombre.trim().length < 2 || nombre.length > 120) return false;
  if (!/^[0-9\s\-+]{7,30}$/.test(telefono.trim())) return false;
  if (mensaje.length > 2000) return false;
  return true;
}

export function renderContactEmail(data: ContactData): RenderedEmail {
  const nombre = escapeHtml(clip(data.nombre ?? data.name ?? "", 120));
  const email = escapeHtml(clip(data.email ?? "", 320));
  const telefono = escapeHtml(clip(data.telefono ?? data.phone ?? "", 30));
  const mensaje = escapeHtml(clip(data.mensaje ?? data.message ?? "", 5000));
  const fecha = escapeHtml(fechaTexto(data.fecha));
  const userAgent = escapeHtml(clip(data.userAgent ?? "", 1000));

  return {
    subject: "Nuevo contacto desde AutoHaus",
    text:
      `Nuevo contacto desde la web de AutoHaus\n\n` +
      `Nombre: ${clip(data.nombre ?? data.name ?? "", 120)}\n` +
      `Email: ${clip(data.email ?? "", 320)}\n` +
      `Telefono: ${clip(data.telefono ?? data.phone ?? "", 30)}\n` +
      `Mensaje: ${clip(data.mensaje ?? data.message ?? "", 5000)}\n` +
      `Fecha: ${fechaTexto(data.fecha)}\n` +
      `UserAgent: ${clip(data.userAgent ?? "", 1000)}\n`,
    html:
      `<h2>Nuevo contacto desde AutoHaus</h2>` +
      `<p><strong>Nombre:</strong> ${nombre}</p>` +
      `<p><strong>Email:</strong> ${email}</p>` +
      `<p><strong>Telefono:</strong> ${telefono}</p>` +
      `<p><strong>Mensaje:</strong> ${mensaje}</p>` +
      `<p><strong>Fecha:</strong> ${fecha}</p>` +
      `<p><strong>UserAgent:</strong> ${userAgent}</p>`,
  };
}

export function renderCallbackEmail(data: CallbackData): RenderedEmail {
  const nombre = escapeHtml(clip(data.nombre ?? data.name ?? "", 120));
  const telefono = escapeHtml(clip(data.telefono ?? data.phone ?? "", 30));
  const mensaje = escapeHtml(clip(data.mensaje ?? data.message ?? "", 2000));
  const fecha = escapeHtml(fechaTexto(data.fecha));
  const userAgent = escapeHtml(clip(data.userAgent ?? "", 1000));

  return {
    subject: "Nueva solicitud de callback - AutoHaus",
    text:
      `Nueva solicitud de callback desde AutoHaus\n\n` +
      `Nombre: ${clip(data.nombre ?? data.name ?? "", 120)}\n` +
      `Telefono: ${clip(data.telefono ?? data.phone ?? "", 30)}\n` +
      `Mensaje: ${clip(data.mensaje ?? data.message ?? "", 2000)}\n` +
      `Fecha: ${fechaTexto(data.fecha)}\n` +
      `UserAgent: ${clip(data.userAgent ?? "", 1000)}\n`,
    html:
      `<h2>Nueva solicitud de callback - AutoHaus</h2>` +
      `<p><strong>Nombre:</strong> ${nombre}</p>` +
      `<p><strong>Telefono:</strong> ${telefono}</p>` +
      `<p><strong>Mensaje:</strong> ${mensaje}</p>` +
      `<p><strong>Fecha:</strong> ${fecha}</p>` +
      `<p><strong>UserAgent:</strong> ${userAgent}</p>`,
  };
}
