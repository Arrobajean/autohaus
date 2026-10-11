import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { readFileSync } from "node:fs";
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { beforeAll, afterAll, beforeEach, describe, it } from "vitest";

let env: RulesTestEnvironment;

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-autohaus",
    firestore: { rules: readFileSync("firestore.rules", "utf8") },
    storage: { rules: readFileSync("storage.rules", "utf8") },
  });
});

afterAll(() => env.cleanup());
beforeEach(() => env.clearFirestore());

const callbackValido = () => ({
  name: "Ana Garcia",
  phone: "+34 600 000 000",
  message: "Llamadme por favor",
  fecha: new Date(),
  status: "nuevo",
  userAgent: "vitest",
});

describe("firestore.rules — cars", () => {
  it("anonimo lee cars pero no escribe", async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertSucceeds(getDoc(doc(db, "cars/c1")));
    await assertFails(setDoc(doc(db, "cars/c1"), { marca: "x" }));
  });

  it("usuario sin claim no escribe cars; admin si", async () => {
    const dbUser = env.authenticatedContext("u1").firestore();
    await assertFails(setDoc(doc(dbUser, "cars/c1"), { marca: "x" }));
    const dbAdmin = env.authenticatedContext("a1", { admin: true }).firestore();
    await assertSucceeds(setDoc(doc(dbAdmin, "cars/c1"), { marca: "x" }));
  });
});

describe("firestore.rules — users y settings", () => {
  it("anonimo no lee users ni settings/site; settings/public si", async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, "users/x")));
    await assertFails(getDoc(doc(db, "settings/site")));
    await assertSucceeds(getDoc(doc(db, "settings/public")));
  });

  it("usuario lee su propio users/{uid} pero no el de otro", async () => {
    const db = env.authenticatedContext("u1").firestore();
    await assertSucceeds(getDoc(doc(db, "users/u1")));
    await assertFails(getDoc(doc(db, "users/otro")));
  });

  it("solo admin escribe settings y lee settings/site", async () => {
    const dbUser = env.authenticatedContext("u1").firestore();
    await assertFails(setDoc(doc(dbUser, "settings/public"), { seo: {} }));
    const dbAdmin = env.authenticatedContext("a1", { admin: true }).firestore();
    await assertSucceeds(getDoc(doc(dbAdmin, "settings/site")));
    await assertSucceeds(setDoc(doc(dbAdmin, "settings/public"), { seo: {} }));
  });
});

describe("firestore.rules — callbacks", () => {
  it("anonimo crea callback valido pero no lo lee", async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertSucceeds(addDoc(collection(db, "callbacks"), callbackValido()));
    await assertFails(getDoc(doc(db, "callbacks/x")));
  });

  it("rechaza callback con campo extra, nombre gigante o telefono invalido", async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertFails(
      addDoc(collection(db, "callbacks"), { ...callbackValido(), extra: 1 })
    );
    await assertFails(
      addDoc(collection(db, "callbacks"), {
        ...callbackValido(),
        name: "x".repeat(10000),
      })
    );
    await assertFails(
      addDoc(collection(db, "callbacks"), { ...callbackValido(), phone: "abc" })
    );
  });

  it("admin lee callbacks", async () => {
    const db = env.authenticatedContext("a1", { admin: true }).firestore();
    await assertSucceeds(getDoc(doc(db, "callbacks/x")));
  });
});

describe("firestore.rules — contactos y envios cerrados", () => {
  it("anonimo no crea contactos ni lee contacto_envios", async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertFails(
      addDoc(collection(db, "contactos"), {
        nombre: "Ana",
        email: "a@b.es",
        telefono: "600000000",
        mensaje: "hola",
      })
    );
    await assertFails(getDoc(doc(db, "contacto_envios/x")));
  });
});

describe("storage.rules", () => {
  it("anonimo no sube; admin sube PNG 1MB; rechaza exe y 20MB", async () => {
    const anon = env.unauthenticatedContext().storage();
    await assertFails(
      uploadBytes(ref(anon, "cars/a.png"), new Uint8Array(1024), {
        contentType: "image/png",
      })
    );

    const admin = env.authenticatedContext("a1", { admin: true }).storage();
    await assertSucceeds(
      uploadBytes(ref(admin, "cars/a.png"), new Uint8Array(1024 * 1024), {
        contentType: "image/png",
      })
    );
    await assertFails(
      uploadBytes(ref(admin, "cars/a.exe"), new Uint8Array(1024), {
        contentType: "application/x-msdownload",
      })
    );
    await assertFails(
      uploadBytes(ref(admin, "cars/big.png"), new Uint8Array(20 * 1024 * 1024), {
        contentType: "image/png",
      })
    );
  });
});
