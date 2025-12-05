# Estructura del Proyecto

Este documento describe la organización de la carpeta `src/`.

## Estructura General

```
src/
├── components/      # Componentes reutilizables
├── pages/          # Páginas y rutas de la aplicación
├── hooks/          # Custom hooks
├── context/        # Context providers de React
├── data/           # Datos estáticos y helpers
├── lib/            # Utilidades y configuraciones
├── types/          # Definiciones de tipos TypeScript
├── App.tsx         # Componente raíz de la aplicación
├── main.tsx        # Punto de entrada
└── index.css       # Estilos globales
```

## Componentes (`components/`)

### `common/`
Componentes comunes reutilizables:
- Modales (LoginModal, CallbackModal)
- Botones animados (RollingTextButton, RotatingTextButton)
- Utilidades (AnimatedSection, PageTransition, ScrollToTop)

### `features/`
Componentes específicos de features del negocio:
- ServiceCard, ServicesCTA, ServicesHero

### `layout/`
Componentes de layout y estructura:
- **navigation/**: Sistema de navegación completo
  - Navigation.tsx (componente principal)
  - Navigation.components.tsx (sub-componentes)
  - Navigation.constants.ts (constantes)
  - useNavigation.ts (hook principal)
  - useMobileMenu.ts (hook del menú móvil)
- **hamburger-menu/**: Menú hamburguesa (legacy, en proceso de migración)
- Footer.tsx
- CookieConsent.tsx
- PublicLayout.tsx

### `routing/`
Componentes relacionados con routing y autenticación:
- ProtectedRoute.tsx (guard de ruta para admin)

### `ui/`
Componentes de UI reutilizables (shadcn/ui y custom):
- Componentes base (button, input, card, etc.)
- **radix/**: Componentes basados en Radix UI con animaciones
  - checkbox.tsx
  - checkbox-primitive.tsx

## Páginas (`pages/`)

### `admin/`
Panel de administración:
- **CarForm/**: Formulario de creación/edición de coches
  - components/ (campos del formulario)
- **Cars/**: Lista de coches
  - components/ (componentes de la lista)
- **Layout/**: Layout del admin
  - components/ (Sidebar, MainContent)
- **helpers/**: Funciones helper del admin
- **hooks/**: Hooks específicos del admin
- Dashboard.tsx, Login.tsx, Profile.tsx, Settings.tsx, Users.tsx

### `site/`
Páginas públicas del sitio:
- **about/**: Página "Nosotros"
- **cars/**: Páginas de coches
  - components/detail/ (componentes de detalle)
  - hooks/ (hooks específicos)
  - utils/ (utilidades)
  - index.tsx, detail.tsx, preview.tsx
- **contact/**: Página de contacto
  - components/ (formulario, mapa, equipo)
  - data/ (datos de contacto)
  - hooks/ (hook del formulario)
- **home/**: Página principal
  - sections/ (secciones del home)
  - data/ (datos estáticos)
  - index.tsx
- **services/**: Página de servicios

## Hooks (`hooks/`)

Custom hooks reutilizables:
- **UI/UX**: useToast, useMobile, useScrollToTop, useLenis
- **Admin**: useAdminSidebar, useCarForm, useDashboard, useCarsList
- **Site**: useCarImages, useHeroImages, useCookieConsent, useWhatsApp
- **Utils**: useCurrentYear, useFeaturedCount, useSiteSettings

## Context (`context/`)

Context providers de React:
- AuthContext.tsx (autenticación)

## Data (`data/`)

Datos estáticos y helpers:
- carBrands.ts (marcas de coches)
- carsData.ts (datos de coches)
- carsHelpers.ts (helpers de coches)
- servicesData.ts (datos de servicios)

## Lib (`lib/`)

Utilidades y configuraciones:
- **Firebase**: firebase.ts, migrateDataToFirebase.ts, testFirebaseConnection.ts
- **Utils**: utils.ts (cn, etc.), get-strict-context.tsx
- **Services**: sendLeadEmail.ts
- **Performance**: performance.ts

## Types (`types/`)

Definiciones de tipos TypeScript:
- index.ts (Car, UserProfile, etc.)

## Convenciones

1. **Componentes**: PascalCase para archivos de componentes
2. **Hooks**: camelCase con prefijo "use"
3. **Utils/Helpers**: camelCase
4. **Types**: PascalCase para interfaces/types
5. **Exports**: Cada carpeta importante tiene un `index.ts` para exports centralizados

## Notas

- Las carpetas vacías han sido eliminadas para mantener la estructura limpia
- Los componentes legacy (como hamburger-menu) se mantienen temporalmente durante la migración
- Los hooks específicos de páginas se mantienen cerca de donde se usan (ej: `pages/admin/hooks/`)

