# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Next.js 15 project using the App Router architecture with TypeScript, Tailwind CSS v4, and Biome for linting and formatting. The project follows Next.js modern conventions with React 19 and uses Turbopack for faster development builds.

## Common Commands

### Development
```bash
# Start development server with Turbopack
pnpm dev

# Build for production with Turbopack
pnpm build

# Start production server
pnpm start
```

### Code Quality
```bash
# Run linter and formatter checks
pnpm lint

# Auto-format code
pnpm format

# TypeScript type checking (run tsc directly)
npx tsc --noEmit
```

### Testing
No test framework is currently configured in this project. When adding tests, consider Next.js testing patterns with Jest and React Testing Library.

## Architecture

### Next.js App Router Structure
- **`src/app/`** - App Router pages and layouts using Next.js 13+ conventions
- **`src/app/layout.tsx`** - Root layout with font optimization (Geist fonts)
- **`src/app/page.tsx`** - Homepage component
- **`src/app/globals.css`** - Global styles with Tailwind CSS and CSS variables

### Key Technologies
- **Next.js 15** with App Router and Turbopack
- **React 19** for UI components
- **TypeScript** with strict mode enabled
- **Tailwind CSS v4** with inline theme configuration
- **Biome** for fast linting, formatting, and import organization
- **PostCSS** for CSS processing

### Styling System
- Uses CSS custom properties for theming (`--background`, `--foreground`)
- Automatic dark mode support via `prefers-color-scheme`
- Tailwind CSS utility classes with custom font variables
- Geist font family integration with variable fonts

### Development Configuration
- **TypeScript**: Strict mode with ES2017 target, path mapping (`@/*` → `./src/*`)
- **Biome**: Configured with React and Next.js rules, auto import organization
- **Next.js**: Clean default configuration, ready for customization

## File Patterns

### Components
- Place React components in `src/app/` following App Router conventions
- Use TypeScript (.tsx) for all React components
- Follow Next.js naming conventions for special files (layout.tsx, page.tsx, etc.)

### Styling
- Global styles go in `src/app/globals.css`
- Use Tailwind utility classes for component styling
- CSS custom properties are defined in globals.css for theming

### Assets
- Static assets go in `public/` directory
- Next.js Image component is used for optimized images
- SVG icons are stored in public/ and referenced directly