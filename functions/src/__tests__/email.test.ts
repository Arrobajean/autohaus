import { describe, it, expect } from "vitest";
import { escapeHtml, clip } from "../lib/escapeHtml";
import {
  renderContactEmail,
  renderCallbackEmail,
  isValidContact,
  isValidCallback,
} from "../lib/email";

describe("escapeHtml", () => {
  it("escapa <, >, &, comillas", () => {
    expect(escapeHtml('<script>alert(1)</script>')).toBe(
      "&lt;script&gt;alert(1)&lt;/script&gt;"
    );
    expect(escapeHtml('"><img src=x onerror=alert(1)>')).toBe(
      "&quot;&gt;&lt;img src=x onerror=alert(1)&gt;"
    );
    expect(escapeHtml("a&b'c\"d")).toBe("a&amp;b&#39;c&quot;d");
  });

  it("null/undefined -> vacio", () => {
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(undefined)).toBe("");
  });
});

describe("renderContactEmail", () => {
  it("no deja etiquetas del usuario sin escapar", () => {
    const out = renderContactEmail({
      nombre: "<script>alert(1)</script>",
      email: "a@b.es",
      telefono: "600000000",
      mensaje: '"><img src=x onerror=alert(1)>',
      userAgent: "ua",
    });
    expect(out.html).not.toContain("<script>");
    expect(out.html).not.toContain("<img");
    expect(out.html).toContain("&lt;script&gt;");
  });

  it("recorta mensaje de 100000 caracteres al limite", () => {
    const out = renderContactEmail({
      nombre: "Ana",
      email: "a@b.es",
      telefono: "600000000",
      mensaje: "x".repeat(100000),
      userAgent: "ua",
    });
    expect(out.html.length).toBeLessThan(20000);
  });

  it("nombre con salto de linea no rompe el html", () => {
    const out = renderContactEmail({
      nombre: "Ana\nGarcia",
      email: "a@b.es",
      telefono: "600000000",
      mensaje: "hola",
      userAgent: "ua",
    });
    expect(out.html).toContain("Ana\nGarcia");
    expect(out.html).not.toContain("<script>");
  });
});

describe("renderCallbackEmail", () => {
  it("escapa todo campo de usuario", () => {
    const out = renderCallbackEmail({
      name: "<b>ana</b>",
      phone: "600000000",
      message: "<img src=x onerror=1>",
      userAgent: "ua",
    });
    expect(out.html).not.toContain("<b>ana</b>");
    expect(out.html).toContain("&lt;b&gt;ana&lt;/b&gt;");
  });
});

describe("validacion", () => {
  it("contacto valido pasa; email/telefono malos no", () => {
    expect(
      isValidContact({
        nombre: "Ana",
        email: "a@b.es",
        telefono: "+34 600 000 000",
        mensaje: "hola, me interesa",
      })
    ).toBe(true);
    expect(
      isValidContact({ nombre: "A", email: "a@b.es", telefono: "600000000", mensaje: "hola" })
    ).toBe(false);
    expect(
      isValidContact({ nombre: "Ana", email: "no-es-email", telefono: "600000000", mensaje: "hola" })
    ).toBe(false);
  });

  it("callback con mensaje de 100000 caracteres se descarta", () => {
    expect(
      isValidCallback({ name: "Ana", phone: "600000000", message: "x".repeat(100000) })
    ).toBe(false);
  });
});

describe("clip", () => {
  it("recorta a max", () => {
    expect(clip("abcdef", 3)).toBe("abc");
  });
});
