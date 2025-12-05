# Layout Components

Estructura organizada de componentes de layout.

## Estructura

```
layout/
├── navigation/          # Componentes y lógica de navegación
│   ├── Navigation.tsx              # Componente principal
│   ├── Navigation.components.tsx   # Sub-componentes (Desktop, Mobile, etc.)
│   ├── Navigation.constants.ts     # Constantes (items de navegación)
│   ├── useNavigation.ts            # Hook principal de navegación
│   ├── useMobileMenu.ts           # Hook para menú móvil
│   └── index.ts                   # Exports
├── Footer.tsx                     # Componente Footer
├── CookieConsent.tsx              # Componente de consentimiento de cookies
├── PublicLayout.tsx               # Layout público principal
└── index.ts                       # Exports principales
```

## Uso

```tsx
import {
  Navigation,
  Footer,
  CookieConsent,
  PublicLayout,
} from "@/components/layout";
```

## Navigation

Todos los archivos relacionados con la navegación están agrupados en la carpeta `navigation/`:

- **Navigation.tsx**: Componente principal que orquesta la navegación
- **Navigation.components.tsx**: Componentes UI (DesktopNavigation, MobileNavigation, MobileMenu, etc.)
- **Navigation.constants.ts**: Constantes como `navigationItems`
- **useNavigation.ts**: Hook con lógica de scroll, detección de páginas, etc.
- **useMobileMenu.ts**: Hook con lógica del menú hamburguesa (Escape key, handlers, etc.)
