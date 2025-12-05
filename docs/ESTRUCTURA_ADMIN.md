# Admin Pages Structure

Estructura híbrida del panel de administración: páginas planas + recursos agrupados por feature.

## Organización

```
admin/
├── pages/                  # Páginas principales (planas, fáciles de encontrar)
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Cars.tsx
│   ├── CarForm.tsx
│   ├── Users.tsx
│   ├── Profile.tsx
│   └── Settings.tsx
├── features/               # Recursos organizados por feature/dominio
│   ├── cars/
│   │   ├── components/      # Componentes específicos de coches
│   │   │   └── SortIcon.tsx
│   │   ├── hooks/          # Hooks específicos
│   │   │   └── useCarsList.ts
│   │   └── helpers/        # Helpers específicos
│   │       └── carsListHelpers.ts
│   ├── car-form/
│   │   ├── components/     # Componentes del formulario
│   │   │   ├── BasicInfoFields.tsx
│   │   │   ├── DescriptionAndFeatured.tsx
│   │   │   ├── FormActions.tsx
│   │   │   ├── ImageGallery.tsx
│   │   │   └── TechnicalSpecs.tsx
│   │   └── helpers/
│   │       └── carFormHelpers.ts
│   ├── users/
│   │   └── helpers/
│   │       └── userHelpers.ts
│   └── dashboard/
│       └── helpers/
│           └── dashboardHelpers.ts
├── layout/                 # Layout y componentes compartidos del admin
│   ├── Layout.tsx
│   └── components/
│       ├── MainContent.tsx
│       └── SidebarContent.tsx
└── shared/                  # Recursos compartidos entre features
    ├── helpers/
    │   └── carValidation.ts  # Validaciones compartidas
    └── hooks/
```

## Principios de Organización

### 1. Páginas Planas (`pages/`)
- Todas las páginas principales en un solo lugar
- Fácil de encontrar y navegar
- Imports simples desde `App.tsx`

### 2. Features Agrupados (`features/`)
- Cada feature tiene sus propios recursos
- Componentes, hooks y helpers juntos por dominio
- Fácil de mantener y escalar

### 3. Layout Separado (`layout/`)
- Componentes de layout independientes
- Reutilizables en todo el admin

### 4. Shared (`shared/`)
- Solo recursos realmente compartidos
- Validaciones, utilidades genéricas

## Imports

### Desde App.tsx
```tsx
import { Login } from "@/pages/admin/pages/Login";
import { AdminLayout } from "@/pages/admin/layout/Layout";
import { Dashboard } from "@/pages/admin/pages/Dashboard";
import { Cars } from "@/pages/admin/pages/Cars";
import { CarForm } from "@/pages/admin/pages/CarForm";
import { Users } from "@/pages/admin/pages/Users";
import { Profile } from "@/pages/admin/pages/Profile";
import { Settings } from "@/pages/admin/pages/Settings";
```

### Desde páginas a features
```tsx
// En pages/Cars.tsx
import { useCarsList } from "../features/cars/hooks/useCarsList";
import { SortIcon } from "../features/cars/components/SortIcon";
import { StatusFilter } from "../features/cars/helpers/carsListHelpers";

// En pages/CarForm.tsx
import { BasicInfoFields } from "../features/car-form/components/BasicInfoFields";
```

### Helpers compartidos
```tsx
// Desde cualquier lugar
import { validateCar } from "@/pages/admin/shared/helpers/carValidation";
import { getMaxFeaturedCars } from "@/pages/admin/features/dashboard/helpers/dashboardHelpers";
```

## Ventajas de esta Estructura

✅ **Páginas visibles**: Todas las páginas en un solo lugar  
✅ **Recursos organizados**: Cada feature tiene sus recursos juntos  
✅ **Fácil navegación**: Estructura predecible  
✅ **Escalable**: Fácil agregar nuevas features  
✅ **Mantenible**: Código relacionado agrupado  

## Agregar una Nueva Feature

1. Crear página en `pages/NewFeature.tsx`
2. Crear carpeta en `features/new-feature/`
3. Agregar componentes, hooks y helpers según necesidad
4. Importar desde la página: `import { Component } from "../features/new-feature/components/Component"`
