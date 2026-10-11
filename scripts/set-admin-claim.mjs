/**
 * Asigna (o quita) el custom claim `admin: true` a una cuenta de Firebase Auth.
 *
 * Por que: firestore.rules y storage.rules comprueban
 * `request.auth.token.admin`. Con el claim puesto, cada operacion del panel
 * se autoriza sin lecturas extra ni latencia.
 *
 * Uso:
 *   node scripts/set-admin-claim.mjs correo@dominio.com            -> asigna admin
 *   node scripts/set-admin-claim.mjs correo@dominio.com --remove   -> lo quita
 *
 * Requiere en .env.local (NO commitear):
 *   FIREBASE_ADMIN_PROJECT_ID=...
 *   FIREBASE_ADMIN_CLIENT_EMAIL=...
 *   FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
 *
 * El usuario debe haber iniciado sesion al menos una vez (existir en Auth)
 * y tendra que cerrar y volver a abrir sesion para que su token incluya el
 * claim nuevo.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const raizProyecto = path.resolve(__dirname, "..");

/** Carga .env.local a process.env sin depender de dotenv. */
function cargarEnvLocal() {
  const rutaEnv = path.join(raizProyecto, ".env.local");
  if (!existsSync(rutaEnv)) return;
  const contenido = readFileSync(rutaEnv, "utf-8");
  for (const linea of contenido.split("\n")) {
    const limpia = linea.trim();
    if (!limpia || limpia.startsWith("#")) continue;
    const igual = limpia.indexOf("=");
    if (igual === -1) continue;
    const clave = limpia.slice(0, igual).trim();
    let valor = limpia.slice(igual + 1).trim();
    if (
      (valor.startsWith('"') && valor.endsWith('"')) ||
      (valor.startsWith("'") && valor.endsWith("'"))
    ) {
      valor = valor.slice(1, -1);
    }
    if (process.env[clave] === undefined) process.env[clave] = valor;
  }
}

cargarEnvLocal();

const email = process.argv[2];
const quitar = process.argv.includes("--remove");

if (!email || !email.includes("@")) {
  console.error("Uso: node scripts/set-admin-claim.mjs correo@dominio.com [--remove]");
  process.exit(1);
}

function getAdminAuth() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    console.error(
      "Faltan credenciales FIREBASE_ADMIN_* en .env.local. Abortando sin tocar nada."
    );
    process.exit(1);
  }

  const app = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  return getAuth(app);
}

async function main() {
  const auth = getAdminAuth();

  let usuario;
  try {
    usuario = await auth.getUserByEmail(email);
  } catch {
    console.error(
      `No existe ningun usuario con el email ${email}. ` +
        "Debe iniciar sesion en el panel al menos una vez antes de asignarle el claim."
    );
    process.exit(1);
  }

  const claims = { ...(usuario.customClaims ?? {}) };
  if (quitar) {
    delete claims.admin;
  } else {
    claims.admin = true;
  }
  await auth.setCustomUserClaims(usuario.uid, claims);

  console.log(
    quitar
      ? `Claim admin QUITADO a ${email} (uid ${usuario.uid}).`
      : `Claim admin asignado a ${email} (uid ${usuario.uid}).`
  );
  console.log(
    "El cambio se aplica cuando el usuario renueve su token: basta cerrar sesion y volver a entrar."
  );
  process.exit(0);
}

main().catch((error) => {
  console.error("Error asignando el claim:", error);
  process.exit(1);
});
