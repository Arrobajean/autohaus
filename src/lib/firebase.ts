import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only if config is present
const isConfigured = !!firebaseConfig.apiKey && 
                     !!firebaseConfig.projectId && 
                     !!firebaseConfig.authDomain;

let app = null;
try {
  if (isConfigured) {
    app = initializeApp(firebaseConfig);
  } else {
    const missingVars = [];
    if (!firebaseConfig.apiKey) missingVars.push('VITE_FIREBASE_API_KEY');
    if (!firebaseConfig.projectId) missingVars.push('VITE_FIREBASE_PROJECT_ID');
    if (!firebaseConfig.authDomain) missingVars.push('VITE_FIREBASE_AUTH_DOMAIN');
    
    console.error('🔥 Firebase no está configurado. Variables faltantes:', missingVars.join(', '));
    console.error('📝 Configura las variables de entorno en Vercel: Settings → Environment Variables');
  }
} catch (error) {
  console.error('❌ Error al inicializar Firebase:', error);
  app = null;
}

export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : null;
export const storage = app ? getStorage(app) : null;
export const googleProvider = new GoogleAuthProvider();

if (!isConfigured && typeof window !== 'undefined') {
  console.warn('⚠️ Firebase no está disponible. La aplicación funcionará en modo limitado.');
}
