/**
 * Escapa texto para interpolarlo en HTML de forma segura.
 * Convierte &, <, >, " y ' en entidades; cualquier otro valor se
 * convierte a string (null/undefined -> "").
 */
export const escapeHtml = (v: unknown): string =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c] as string
  );

/** Recorta a `max` caracteres (en texto plano, antes de escapar). */
export const clip = (v: unknown, max: number): string =>
  String(v ?? "").slice(0, max);
