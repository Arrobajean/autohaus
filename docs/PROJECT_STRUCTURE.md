# Estructura del Proyecto

Este documento describe la organización de archivos y carpetas del proyecto.

## 📁 Estructura de Carpetas

```
.
├── docs/                    # 📚 Documentación adicional
│   ├── README.md
│   ├── VERCEL_DEPLOY.md
│   ├── CONFIGURAR_VERCEL.md
│   └── noop.ipynb
├── src/                     # 💻 Código fuente
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── lib/
│   └── ...
├── functions/               # 🔥 Firebase Cloud Functions
├── public/                  # 🌐 Assets públicos
├── dist/                    # 📦 Build de producción (generado)
└── [archivos de configuración en raíz]
```

## 📄 Archivos en la Raíz

### Configuraciones Principales (deben estar en raíz)

Estos archivos **deben** estar en la raíz porque las herramientas los buscan ahí:

- **`package.json`**, **`package-lock.json`**: Gestión de dependencias
- **`vite.config.ts`**: Configuración de Vite
- **`tsconfig.json`**, **`tsconfig.app.json`**, **`tsconfig.node.json`**: Configuración TypeScript
- **`tailwind.config.ts`**: Configuración de Tailwind CSS
- **`postcss.config.js`**: Configuración de PostCSS
- **`eslint.config.js`**: Configuración principal de ESLint
- **`index.html`**: Punto de entrada HTML
- **`vercel.json`**: Configuración de Vercel
- **`components.json`**: Configuración de shadcn/ui
- **`.gitignore`**, **`.vercelignore`**: Archivos ignorados
- **`README.md`**: Documentación principal

### Configuraciones de Firebase (deben estar en raíz)

Firebase CLI busca estos archivos en la raíz:

- **`firebase.json`**: Configuración de Firebase
- **`firestore.rules`**: Reglas de seguridad de Firestore
- **`storage.rules`**: Reglas de seguridad de Storage

## 📚 Documentación (`docs/`)

Documentación adicional del proyecto:

- **`VERCEL_DEPLOY.md`**: Guía completa para desplegar en Vercel
- **`CONFIGURAR_VERCEL.md`**: Guía para configurar variables de entorno
- **`noop.ipynb`**: Notebook de pruebas (opcional)

## 🎯 Principios de Organización

1. **Configuraciones principales en raíz**: Las herramientas (Vite, TypeScript, ESLint, etc.) buscan sus configuraciones en la raíz
2. **Documentación agrupada**: Toda la documentación adicional en `docs/`
3. **Firebase en raíz**: Firebase CLI requiere archivos de configuración en la raíz

## 📝 Notas

- Los archivos de configuración principales **no deben moverse** de la raíz
- La documentación puede organizarse en `docs/` para mantener la raíz limpia

