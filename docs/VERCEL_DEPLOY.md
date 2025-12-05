# Guía de Deploy en Vercel

## ✅ Checklist Pre-Deploy

### 1. Variables de Entorno en Vercel

Configura las siguientes variables de entorno en el proyecto de Vercel (Settings → Environment Variables):

```
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_MEASUREMENT_ID=tu_measurement_id
```

**Importante:** Asegúrate de añadir estas variables para todos los entornos (Production, Preview, Development).

### 2. Configuración del Proyecto en Vercel

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`
- **Node Version:** 18.x o superior (recomendado)

### 3. Configuración de Firebase

Asegúrate de que:
- ✅ Las reglas de Firestore (`firestore.rules`) están desplegadas
- ✅ Las reglas de Storage (`storage.rules`) están desplegadas
- ✅ Los dominios de Vercel están autorizados en Firebase Authentication

### 4. Rutas y Rewrites

El archivo `vercel.json` ya está configurado con:
- ✅ Rewrites para SPA (todas las rutas → `/index.html`)
- ✅ Headers de seguridad
- ✅ Cache para assets estáticos

### 5. Build Verification

El build se ha verificado y funciona correctamente:
- ✅ Firebase se resuelve correctamente
- ✅ Chunks optimizados
- ✅ Assets organizados

## 🚀 Pasos para Deploy

1. Conecta tu repositorio de GitHub a Vercel
2. Configura las variables de entorno (ver arriba)
3. Verifica que el Framework Preset sea "Vite"
4. Haz clic en "Deploy"

## 📝 Notas Importantes

- El archivo `.env` está en `.gitignore` (correcto)
- Las variables deben tener el prefijo `VITE_` para que Vite las exponga
- El build genera archivos en `dist/` que Vercel servirá automáticamente
- Las rutas del admin (`/admin/*`) requieren autenticación (modo preview activo)

## 🔍 Verificación Post-Deploy

Después del deploy, verifica:
- [ ] La página principal carga correctamente
- [ ] Las rutas de coches funcionan (`/coches`, `/coches/:slug`)
- [ ] El panel admin es accesible (`/admin/login`)
- [ ] Firebase se conecta correctamente (revisa la consola del navegador)
- [ ] Las imágenes se cargan desde Firebase Storage

