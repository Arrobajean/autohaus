# 🔧 Configurar Variables de Entorno en Vercel

## ⚠️ Problema Común

Si después del deploy en Vercel no ves la base de datos ni la conexión con Firebase, **es porque las variables de entorno no están configuradas**.

## 📋 Pasos para Configurar Variables de Entorno en Vercel

### 1. Accede a la Configuración del Proyecto

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Selecciona tu proyecto **autohaus**
3. Ve a **Settings** (Configuración)
4. Haz clic en **Environment Variables** (Variables de Entorno)

### 2. Añade las Variables de Firebase

Añade **TODAS** estas variables (una por una):

| Variable                            | Valor                  | Ejemplo                                     |
| ----------------------------------- | ---------------------- | ------------------------------------------- |
| `VITE_FIREBASE_API_KEY`             | Tu API Key de Firebase | `AIzaSy…TU_CLAVE`   |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Tu Auth Domain         | `autohaus-8531f.firebaseapp.com`            |
| `VITE_FIREBASE_PROJECT_ID`          | Tu Project ID          | `autohaus-8531f`                            |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Tu Storage Bucket      | `autohaus-8531f.firebasestorage.app`        |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Tu Messaging Sender ID | `576326792516`                              |
| `VITE_FIREBASE_APP_ID`              | Tu App ID              | `1:576326792516:web:41be1973433db40bec9311` |
| `VITE_FIREBASE_MEASUREMENT_ID`      | Tu Measurement ID      | `G-NM36ZK7GDD`                              |

### 3. Configura para Todos los Entornos

**IMPORTANTE:** Al añadir cada variable, selecciona:

- ✅ **Production** (Producción)
- ✅ **Preview** (Vista previa)
- ✅ **Development** (Desarrollo)

O simplemente deja todas marcadas.

### 4. Obtén los Valores desde Firebase Console

Si no tienes los valores, obténlos desde:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **autohaus-8531f**
3. Ve a **⚙️ Configuración del proyecto** (Settings → Project settings)
4. Baja hasta **Tus aplicaciones** y selecciona la app web
5. Copia los valores del objeto `firebaseConfig`

### 5. Redespliega la Aplicación

Después de añadir las variables:

1. Ve a la pestaña **Deployments** en Vercel
2. Haz clic en los **3 puntos** (⋯) del último deployment
3. Selecciona **Redeploy**
4. O simplemente haz un nuevo commit y push (Vercel desplegará automáticamente)

## ✅ Verificación

Después del redeploy, verifica:

1. **Abre la consola del navegador** (F12) en tu sitio desplegado
2. **No deberías ver** el error: `Firebase no está configurado`
3. **En el panel admin** (`/admin`), deberías ver:
   - "Estado Firebase: Conectado"
   - "Total de Coches: X" (si hay datos)

## 🔍 Troubleshooting

### Si aún no funciona:

1. **Verifica que las variables estén bien escritas:**

   - Deben empezar con `VITE_`
   - Sin espacios antes o después
   - Valores exactos (sin comillas)

2. **Verifica que estén en el entorno correcto:**

   - Si estás en producción, deben estar marcadas para **Production**
   - Si estás en preview, deben estar marcadas para **Preview**

3. **Limpia la caché:**

   - En Vercel, ve a Settings → General
   - Haz clic en "Clear Build Cache"
   - Redespliega

4. **Revisa los logs de build:**
   - En Vercel, ve a la pestaña Deployments
   - Haz clic en el deployment
   - Revisa los "Build Logs" para ver si hay errores

## 📝 Nota Importante

Las variables de entorno **NO** se pueden leer desde el código si no están configuradas en Vercel. El archivo `.env` local **NO** se sube a producción (está en `.gitignore`), por eso debes configurarlas manualmente en Vercel.
