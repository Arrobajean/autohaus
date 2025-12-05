<div align="center">

# AutoHaus — Sitio web corporativo

Vite + React + TypeScript · Tailwind CSS · Firebase (Firestore + Functions) · Vercel

</div>

## 🚀 Descripción

Este repositorio contiene el código del sitio web corporativo de AutoHaus. Está construido con Vite + React + TypeScript, estilos con Tailwind CSS, SEO con `react-helmet-async` y persistencia de leads en Firebase/Firestore. Opcionalmente, se incluyen Cloud Functions para notificaciones por email al recibir nuevos leads.

## 📦 Tecnologías principales

- Vite, React 18, TypeScript
- Tailwind CSS y componentes basados en Radix UI
- React Router, Framer Motion, GSAP, Lenis
- SEO con `react-helmet-async`
- Firebase (Firestore, opcionalmente Functions y Admin)
- Vercel (hosting recomendado)

## 🗂️ Estructura del proyecto (resumen)

```
.
├─ src/
│  ├─ components/        # UI y secciones
│  ├─ data/              # Datos estáticos de servicios y proyectos
│  ├─ hooks/             # Hooks personalizados
│  ├─ lib/               # Integraciones (firebase, utils, email)
│  ├─ pages/             # Rutas y páginas
│  ├─ main.tsx           # Entrypoint
│  └─ index.css          # Estilos globales
├─ functions/            # (Opcional) Cloud Functions para notificaciones
├─ public/               # Assets públicos
├─ vite.config.ts        # Configuración Vite
├─ tailwind.config.ts    # Configuración Tailwind
└─ vercel.json           # Configuración de despliegue en Vercel
```

## ✅ Requisitos previos

- Node.js 18+
- npm 9+ (o pnpm/yarn). El proyecto incluye `package-lock.json` (npm). Opcionalmente existe `bun.lockb`, pero se recomienda npm en este repo.
- Cuenta de Firebase (para Firestore y/o Functions)
- Cuenta en Vercel (para despliegue)

## 🔧 Instalación y uso

1. Clona el repositorio

```bash
git clone <URL_DEL_REPO>
cd autohaus
```

2. Instala dependencias

```bash
npm install
```

3. Variables de entorno

Crea un archivo `.env` en la raíz con:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

4. Desarrollo local

```bash
npm run dev
```

5. Build y preview

```bash
npm run build
npm run preview
```

6. Linter

```bash
npm run lint
```

## 🧩 Scripts disponibles

- `npm run dev`: inicia el entorno de desarrollo con Vite.
- `npm run build`: genera la build de producción en `dist/`.
- `npm run build:dev`: build en modo desarrollo (útil para validaciones rápidas).
- `npm run preview`: sirve la build de producción localmente.
- `npm run lint`: ejecuta ESLint.

## 🔒 Reglas de seguridad en Firestore (recomendadas)

```plaintext
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contactos/{document} {
      allow create: if true;
      allow read, update, delete: if false;
    }
    match /callbacks/{document} {
      allow create: if true;
      allow read, update, delete: if false;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## ✉️ Notificaciones por email (Cloud Functions opcional)

- Puedes disparar un email cuando llega un nuevo lead.
- Base sugerida en `src/lib/sendLeadEmail.ts`.
- Carpeta de funciones: `functions/` con Node 18.

Comandos útiles dentro de `functions/`:

```bash
# Instalar dependencias de funciones
cd functions && npm install

# Compilar y emular
npm run build && npm run serve

# Desplegar solo funciones
npm run deploy
```

## 🌐 SEO y rendimiento

- Metadatos con `react-helmet-async` (títulos, descripciones, Open Graph, schema.org).
- Imágenes optimizadas y assets estáticos en `public/`.
- Animaciones eficientes con Framer Motion/GSAP y scroll suave con Lenis.

## 🚀 Despliegue

### Vercel (recomendado)

1. Conecta el repositorio en Vercel.
2. Framework Preset: Vite.
3. Build Command: `npm run build` · Output: `dist`
4. Configura las variables de entorno en el proyecto de Vercel.

### Firebase (solo Functions o hosting alternativo)

- Si utilizas Cloud Functions, despliega desde `functions/` con `npm run deploy`.
- El frontend puede alojarse en Vercel; no es obligatorio usar Firebase Hosting.

## 📝 Comentarios del proyecto

### Objetivo y alcance

- Este proyecto actúa como sitio corporativo orientado a captación de leads con foco en SEO local y velocidad de carga.
- La arquitectura prioriza simplicidad (SPA con React + Vite) y DX rápida para iterar contenido/landing pages.

### Decisiones técnicas destacadas

- SPA con `react-router-dom` para mantener tiempos de carga mínimos y control total del frontend.
- `react-helmet-async` para SEO, titles dinámicos y metadatos por página.
- Animaciones con Framer Motion/GSAP y scroll suave con Lenis para una experiencia moderna sin sacrificar rendimiento.
- Firebase/Firestore como backend ligero para leads; Cloud Functions opcional para notificaciones por email.

### Convenciones de código

- TypeScript estrictamente tipado en componentes y utilidades públicas.
- Nombres descriptivos (evitar abreviaturas), early-returns y manejo explícito de errores.
- Componentes UI desacoplados en `src/components/ui` y secciones en `src/components/sections`/`company`/`features`.
- Hooks reutilizables en `src/hooks` para lógica de UI/UX (scroll, toasts, menú, etc.).

### Calidad, accesibilidad y rendimiento

- Accesibilidad: uso de Radix UI y atributos ARIA cuando aplica; contraste y foco visibles.
- Performance: imágenes optimizadas en `public/`, CSS de Tailwind treeshakeado, dependencias auditadas.
- LCP: hero optimizado, preload de fuentes/recursos críticos en `index.html` si es necesario.

### Seguridad y datos

- Nunca comprometer `.env` (está ignorado). Las reglas de Firestore limitan operaciones a `create` en colecciones de leads.
- Sanitización/validación de formularios con `react-hook-form` + `zod` (donde aplique) y honeypot anti-spam.

### SEO y contenidos

- Metadatos por página, Open Graph y `schema.org` en `public/schema.json` y/o por ruta.
- Sitemap y robots en `public/` con foco en SEO local.

### Roadmap sugerido

- Server-Side Rendering/Static Generation (p. ej., migración a Next.js si se buscan mejoras SEO adicionales).
- Pruebas E2E ligeras para formularios (Playwright) y visual regression en componentes críticos.
- Panel interno para visualizar leads y estados (apoyado en Firestore Security Rules).

### FAQ breve

- ¿Puedo usar Firebase Hosting? Sí, pero el flujo actual está optimizado para Vercel + Functions opcional.
- ¿Dónde configuro los servicios/landing? En `src/data` y las secciones dentro de `src/components`.
- ¿Cómo cambio metadatos? Usar `react-helmet-async` en cada página dentro de `src/pages`.

## 🧱 Guías adicionales

La documentación adicional se encuentra en esta carpeta `docs/`:

- [README.md](./README.md): índice de toda la documentación
- [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md): guía completa para desplegar en Vercel
- [CONFIGURAR_VERCEL.md](./CONFIGURAR_VERCEL.md): guía para configurar variables de entorno en Vercel
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md): estructura del proyecto
- [ESTRUCTURA_SRC.md](./ESTRUCTURA_SRC.md): estructura de la carpeta `src/`
- [ESTRUCTURA_ADMIN.md](./ESTRUCTURA_ADMIN.md): estructura del panel de administración
- [ESTRUCTURA_LAYOUT.md](./ESTRUCTURA_LAYOUT.md): estructura de componentes de layout

## 🤝 Contribución

1. Crea una rama desde `main`.
2. Realiza los cambios siguiendo la guía de estilo y ejecuta `npm run lint`.
3. Abre un Pull Request describiendo claramente el cambio y su impacto.

## 📄 Licencia

© 2025 AutoHaus. Todos los derechos reservados.

---

¿Dudas o incidencias? Abre un Issue o contacta con el equipo de desarrollo.
