# Luka - Personal Finance Management 💰

> **"Tu compañero inteligente para alcanzar la libertad financiera"**

Luka es una aplicación web moderna de gestión financiera personal que te ayuda a tomar control de tu dinero, establecer metas de ahorro, y alcanzar tus objetivos financieros de manera simple y efectiva.

## 🚀 Características Principales

- **🎯 Estrategias Financieras Personalizadas**: Elige entre diferentes estrategias (Recomendado, Conservador, Ahorrador, Inversionista) según tu perfil
- **💳 Gestión de Fuentes**: Administra múltiples fuentes de dinero (efectivo, cuentas bancarias, tarjetas)
- **📊 Visualización de Datos**: Preview en tiempo real de tus fuentes y estrategias
- **🔐 Autenticación Segura**: Login con Google mediante Auth.js (NextAuth.js v5)
- **🎨 UI/UX Moderna**: Interfaz elegante con animaciones fluidas usando Framer Motion
- **📱 Responsive Design**: Optimizado para mobile, tablet y desktop

## 🛠️ Stack Tecnológico

### Core
- **[Next.js 15](https://nextjs.org/)** - React framework con App Router y Turbopack
- **[React 19](https://react.dev/)** - Biblioteca de UI
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático

### Styling
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Framework CSS utility-first
- **CSS Modules** - Estilos encapsulados por componente

### Backend & Database
- **[Prisma](https://www.prisma.io/)** - ORM type-safe
- **PostgreSQL** - Base de datos relacional

### Authentication
- **[Auth.js (NextAuth.js v5)](https://authjs.dev/)** - Autenticación completa
- **Google OAuth** - Login social

### State Management
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Estado global ligero

### Validation & Forms
- **[Zod](https://zod.dev/)** - Validación de esquemas
- **[React Hook Form](https://react-hook-form.com/)** - Manejo de formularios

### UI Components
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes accesibles y customizables
- **[Lucide React](https://lucide.dev/)** - Iconos modernos
- **[Framer Motion](https://www.framer.com/motion/)** - Animaciones fluidas

### Code Quality
- **[Biome](https://biomejs.dev/)** - Linter y formatter ultrarrápido
- **[pnpm](https://pnpm.io/)** - Package manager eficiente

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/thecamo1509/LukaWebApp.git
cd LukaWebApp

# Instalar dependencias con pnpm
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus credenciales

# Ejecutar migraciones de base de datos
pnpm dlx prisma migrate dev

# Iniciar servidor de desarrollo
pnpm dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🔧 Scripts Disponibles

```bash
# Desarrollo
pnpm dev          # Inicia servidor de desarrollo con Turbopack
pnpm build        # Build de producción
pnpm start        # Inicia servidor de producción

# Base de datos
pnpm dlx prisma generate      # Genera Prisma Client
pnpm dlx prisma migrate dev   # Ejecuta migraciones
pnpm dlx prisma studio        # Abre Prisma Studio

# Calidad de código
pnpm lint         # Ejecuta Biome linter
pnpm format       # Formatea código con Biome

# Testing
pnpm test         # Ejecuta tests
pnpm test:watch   # Tests en modo watch
```

## 🌳 Estructura del Proyecto

```
luka/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Grupo de rutas de auth
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard principal
│   │   ├── onboarding/        # Wizard de onboarding
│   │   └── login/             # Página de login
│   ├── components/            # Componentes React
│   │   ├── ui/                # shadcn/ui components
│   │   ├── AnimatedContent/   # Componente de animaciones
│   │   ├── LoginForm/         # Formulario de login
│   │   ├── SourceForm/        # Formulario de fuentes
│   │   ├── SourcePreviewCard/ # Preview de fuentes
│   │   ├── StrategyCard/      # Tarjeta de estrategia
│   │   └── OnboardingWizard/  # Wizard de onboarding
│   ├── lib/
│   │   ├── dal/               # Data Access Layer
│   │   ├── prisma.ts          # Prisma client
│   │   └── utils.ts           # Utilidades
│   ├── store/                 # Zustand stores
│   ├── actions/               # Server Actions
│   ├── types/                 # TypeScript types globales
│   └── auth.ts                # Configuración Auth.js
├── prisma/
│   └── schema.prisma          # Schema de base de datos
├── public/                     # Assets estáticos
├── agents/                     # Guías para AI agents
│   ├── frontend/
│   │   └── styling.md         # Guías de CSS
│   └── git.md                 # Guías de Git
├── CLAUDE.md                   # Documentación principal
└── README.md                   # Este archivo
```

## 🎯 Flujo de Onboarding

1. **Paso 1 - Estrategia**: Usuario selecciona su estrategia financiera
2. **Paso 2 - Fuente**: Usuario agrega su primera fuente de dinero
3. **Paso 3 - Login**: Usuario revisa su configuración e inicia sesión

## 🔐 Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/luka"

# Auth.js
AUTH_SECRET="your-secret-key"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Resend (opcional)
RESEND_API_KEY="your-resend-api-key"
```

## 🤝 Contribución

Este proyecto sigue [Conventional Commits](https://www.conventionalcommits.org/). Por favor, lee [agents/git.md](./agents/git.md) para las guías de contribución.

## 📋 Arquitectura y Patrones

- **Server Components por defecto**: Páginas y componentes son Server Components
- **Data Access Layer (DAL)**: Toda interacción con BD a través del DAL
- **Type Safety**: TypeScript estricto, tipos en archivos `.types.ts`
- **CSS Modules**: Un archivo `.module.css` por componente
- **Single @apply**: CSS limpio con una línea de @apply
- **Componentes < 250 líneas**: Componentes pequeños y reutilizables

## 📝 Licencia

Este proyecto es privado y confidencial.

## 👥 Autores

- **Camilo Morales** - [@thecamo1509](https://github.com/thecamo1509)

---

**Hecho con ❤️ usando Next.js 15 y TypeScript**
