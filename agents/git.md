# Git Guidelines - Conventional Commits

Esta guía establece las reglas y mejores prácticas para el control de versiones en el proyecto Luka.

## 📋 Tabla de Contenidos

- [Conventional Commits](#conventional-commits)
- [Tipos de Commit](#tipos-de-commit)
- [Estructura del Commit](#estructura-del-commit)
- [Ejemplos](#ejemplos)
- [Reglas de Branch](#reglas-de-branch)
- [Flujo de Trabajo](#flujo-de-trabajo)

## 🎯 Conventional Commits

Este proyecto sigue la especificación de [Conventional Commits](https://www.conventionalcommits.org/) para mantener un historial de commits claro y semántico.

### Beneficios

- ✅ Historial de cambios claro y legible
- ✅ Generación automática de CHANGELOGs
- ✅ Versionado semántico automático
- ✅ Mejor colaboración en equipo
- ✅ Commits más significativos

## 📝 Tipos de Commit

### Tipos Principales

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `feat` | Nueva funcionalidad | `feat: add user authentication` |
| `fix` | Corrección de bug | `fix: resolve login redirect issue` |
| `docs` | Cambios en documentación | `docs: update README with setup instructions` |
| `style` | Cambios de formato (no afectan lógica) | `style: format code with Biome` |
| `refactor` | Refactorización de código | `refactor: simplify validation logic` |
| `perf` | Mejoras de rendimiento | `perf: optimize image loading` |
| `test` | Agregar o modificar tests | `test: add unit tests for SourceForm` |
| `chore` | Tareas de mantenimiento | `chore: update dependencies` |
| `ci` | Cambios en CI/CD | `ci: add GitHub Actions workflow` |
| `build` | Cambios en build system | `build: configure Turbopack` |
| `revert` | Revertir un commit anterior | `revert: feat: add dark mode` |

### Tipos Específicos del Proyecto

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `feat(onboarding)` | Nueva feature en onboarding | `feat(onboarding): add step 3 login` |
| `feat(dashboard)` | Nueva feature en dashboard | `feat(dashboard): add expense tracking` |
| `feat(auth)` | Cambios en autenticación | `feat(auth): implement Google OAuth` |
| `fix(ui)` | Corrección en UI/componentes | `fix(ui): center strategy card icon` |
| `fix(db)` | Corrección en base de datos | `fix(db): update Prisma schema` |

## 📐 Estructura del Commit

```
<tipo>[scope opcional]: <descripción>

[cuerpo opcional]

[footer(s) opcional(es)]
```

### Reglas

1. **Tipo**: Siempre en minúsculas
2. **Scope**: Opcional, entre paréntesis, describe la sección afectada
3. **Descripción**: 
   - Máximo 72 caracteres
   - En minúsculas
   - Sin punto final
   - Modo imperativo ("add" no "added" o "adds")
4. **Cuerpo**: Opcional, explica el QUÉ y POR QUÉ (no el CÓMO)
5. **Footer**: Opcional, para breaking changes o referencias

### Breaking Changes

Para cambios que rompen compatibilidad:

```
feat!: remove support for Node 14

BREAKING CHANGE: Node 14 is no longer supported. Please upgrade to Node 18+.
```

O:

```
feat(api)!: change authentication endpoint

The /auth endpoint now requires a token parameter.
```

## 💡 Ejemplos

### Ejemplos Básicos

```bash
# Nueva funcionalidad
feat: add source preview card component

# Corrección de bug
fix: resolve validation errors not showing

# Documentación
docs: add installation instructions to README

# Estilo de código
style: apply Biome formatting to all files

# Refactorización
refactor: extract validation logic to separate file

# Performance
perf: lazy load strategy icons

# Tests
test: add unit tests for LoginForm component

# Mantenimiento
chore: update Next.js to version 15.1
```

### Ejemplos con Scope

```bash
# Onboarding
feat(onboarding): add multi-step wizard
feat(onboarding): implement strategy selection
fix(onboarding): correct step navigation logic

# Components
feat(ui): add SourcePreviewCard component
fix(ui): center icons in StrategyCard
style(ui): consolidate @apply statements in CSS

# Store
feat(store): add Zustand store for onboarding state
refactor(store): use Strategy object instead of type only

# Authentication
feat(auth): implement Google OAuth login
fix(auth): resolve session persistence issue

# Database
feat(db): add Prisma schema for sources
fix(db): update source model with color field
```

### Ejemplos con Cuerpo

```bash
feat(onboarding): add Strategy object to store

Previously we only stored the strategy type (string), which caused
issues when navigating between steps. Now we store the complete
Strategy object including name, iconName, and allocation.

This resolves the issue where strategy icons and names wouldn't
display correctly in Step 3 after changing strategies.
```

### Ejemplos con Breaking Changes

```bash
feat(api)!: change source creation endpoint

BREAKING CHANGE: The POST /api/sources endpoint now requires
the `color` field to be a valid hex color code instead of a
color name string.

Migration guide:
- Before: { color: "blue" }
- After: { color: "#3B82F6" }
```

## 🌿 Reglas de Branch

### Nombres de Branch

```bash
# Features
feature/user-authentication
feature/onboarding-wizard
feature/dashboard-layout

# Fixes
fix/login-redirect
fix/strategy-icon-display
fix/form-validation

# Refactors
refactor/state-management
refactor/component-structure

# Documentación
docs/api-documentation
docs/setup-guide
```

### Convenciones

- Usa kebab-case (palabras en minúsculas separadas por guiones)
- Prefijos: `feature/`, `fix/`, `refactor/`, `docs/`, `chore/`
- Nombres descriptivos y concisos
- Incluye el número de issue si aplica: `feature/123-add-dark-mode`

## 🔄 Flujo de Trabajo

### 1. Crear Branch desde main

```bash
git checkout main
git pull origin main
git checkout -b feature/new-feature
```

### 2. Hacer Cambios y Commits

```bash
# Hacer cambios en el código
git add .
git commit -m "feat: add new feature"
```

### 3. Push y Pull Request

```bash
git push origin feature/new-feature
# Crear Pull Request en GitHub
```

### 4. Merge a Main

```bash
# Después de review y aprobación
git checkout main
git merge feature/new-feature
git push origin main
```

## ✅ Checklist de Commit

Antes de hacer commit, verifica:

- [ ] El código pasa `pnpm lint`
- [ ] El código pasa `pnpm format`
- [ ] No hay errores de TypeScript
- [ ] Los tests pasan (si aplica)
- [ ] El mensaje sigue Conventional Commits
- [ ] La descripción es clara y concisa
- [ ] El scope es apropiado (si aplica)

## 🚫 Anti-Patrones (Evitar)

```bash
# ❌ Descripción vaga
git commit -m "fix stuff"
git commit -m "update code"
git commit -m "changes"

# ❌ Descripción muy larga
git commit -m "feat: add a new component that displays user information and also updates the state and also adds validation and also..."

# ❌ Mezclar múltiples cambios
git commit -m "feat: add login and fix bugs and update docs"

# ❌ Mayúsculas incorrectas
git commit -m "Feat: Add Feature"
git commit -m "FIX: bug fix"

# ❌ Punto final en descripción
git commit -m "feat: add new feature."

# ❌ Tiempo verbal incorrecto
git commit -m "feat: added new feature"
git commit -m "fix: fixed the bug"
```

## ✅ Mejores Prácticas

```bash
# ✅ Un commit por cambio lógico
git commit -m "feat(auth): add Google OAuth provider"
git commit -m "test(auth): add tests for Google OAuth"
git commit -m "docs(auth): document OAuth setup"

# ✅ Descripción clara en imperativo
git commit -m "fix(ui): center strategy card icon"
git commit -m "refactor(store): extract types to separate file"

# ✅ Scope apropiado
git commit -m "feat(onboarding): implement step navigation"
git commit -m "fix(validation): show errors on blur"

# ✅ Breaking changes bien documentados
git commit -m "feat(api)!: change authentication flow

BREAKING CHANGE: Authentication now requires OAuth tokens
instead of API keys. Update your integration accordingly."
```

## 📚 Referencias

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)
- [Semantic Versioning](https://semver.org/)

---

**Recuerda**: Los commits son documentación. Escribe mensajes que tu yo del futuro agradecerá leer.

