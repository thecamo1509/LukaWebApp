# Styling Rules - CSS Modules Only

## Documentation Reference

**IMPORTANT: Use Context7 for library documentation**

When you need documentation for external libraries, use Context7 to fetch the most up-to-date information:

- **shadcn/ui components** - Use Context7 to get component API, examples, and usage patterns
- **Tailwind CSS** - Use Context7 for utility classes and configuration
- **React/Next.js** - Use Context7 for framework-specific patterns
- Any other library documentation needed for this project

**Example usage:**
- Before implementing a shadcn component, fetch its docs via Context7
- When unsure about Tailwind utilities, check Context7
- For Next.js patterns (Server Components, etc.), consult Context7

---

## Mandatory Rules

1. **NEVER use Tailwind classes directly in JSX/TSX**
   ```tsx
   // ❌ WRONG
   <button className="px-4 py-2 bg-blue-500">Click</button>
   
   // ✅ CORRECT
   import styles from './Button.module.css'
   <button className={styles.primary}>Click</button>
   ```

2. **Every component MUST have a corresponding `.module.css` file**
   ```
   Button/
     Button.tsx
     Button.module.css  ← Required
   ```

3. **File naming: `ComponentName.module.css`** (exact case match)
   ```
   Button.tsx      → Button.module.css
   UserCard.tsx    → UserCard.module.css
   DataTable.tsx   → DataTable.module.css
   ```

4. **Never use regular `.css` files for components** (only `.module.css`)

5. **Use `@apply` for all Tailwind utilities**
   ```css
   /* ✅ CORRECT */
   .button {
     @apply px-4 py-2 bg-blue-500 text-white rounded-lg;
   }
   
   /* ❌ WRONG - don't write raw CSS for Tailwind utilities */
   .button {
     padding: 1rem;
     background-color: #3B82F6;
   }
   ```

---

## Import Pattern

**Always use this exact pattern:**

```tsx
import styles from './ComponentName.module.css'

export function ComponentName() {
  return <div className={styles.container}>Content</div>
}
```

---

## Class Naming Convention

Use camelCase for all CSS class names:

```css
/* Button.module.css */
.primary { }           /* variant */
.secondary { }         /* variant */
.sizeLg { }            /* modifier */
.disabled { }          /* state */
.iconButton { }        /* compound name */
.buttonWithIcon { }    /* compound name */
```

**Never use:**
- kebab-case: `.button-primary` ❌
- snake_case: `.button_primary` ❌
- Abbreviations: `.btn`, `.crd` ❌

---

## Required File Structure

```css
/* ComponentName.module.css */

/* 1. Base styles (required) */
.container {
  @apply /* base utilities */;
}

/* 2. Variants (if applicable) */
.variantPrimary {
  @apply /* variant utilities */;
}

.variantSecondary {
  @apply /* variant utilities */;
}

/* 3. Child elements (if applicable) */
.header {
  @apply /* header utilities */;
}

.body {
  @apply /* body utilities */;
}

/* 4. States (if applicable) */
.active {
  @apply /* active state utilities */;
}

.disabled {
  @apply /* disabled state utilities */;
}
```

---

## Handling Dynamic Classes

**Use the `cn()` utility for conditional classes:**

```tsx
// lib/utils.ts (create this file once)
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

```tsx
// Component.tsx
import { cn } from '@/lib/utils'
import styles from './Component.module.css'

export function Component({ isActive, variant = 'primary' }) {
  return (
    <div className={cn(
      styles.base,
      styles[variant],
      isActive && styles.active
    )}>
      Content
    </div>
  )
}
```

---

## Responsive Design Pattern

Use Tailwind responsive prefixes inside `@apply`:

```css
.hero {
  /* Mobile first - no prefix */
  @apply px-4 py-8 text-2xl;
  
  /* Tablet - md: prefix */
  @apply md:px-8 md:py-16 md:text-4xl;
  
  /* Desktop - lg: prefix */
  @apply lg:px-12 lg:py-24 lg:text-6xl;
}
```

---

## Component Variants Pattern

```tsx
// Button.tsx
import { cn } from '@/lib/utils'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: Variant
  size?: Size
  disabled?: boolean
  children: React.ReactNode
}

export function Button({ 
  variant = 'primary',
  size = 'md',
  disabled = false,
  children 
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        styles.base,
        styles[variant],
        styles[size]
      )}
    >
      {children}
    </button>
  )
}
```

```css
/* Button.module.css */
.base {
  @apply font-medium rounded-lg transition-all duration-200;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

/* Variants */
.primary {
  @apply bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500;
}

.secondary {
  @apply bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500;
}

.danger {
  @apply bg-red-500 text-white hover:bg-red-600 focus:ring-red-500;
}

/* Sizes */
.sm {
  @apply px-3 py-1.5 text-sm;
}

.md {
  @apply px-4 py-2 text-base;
}

.lg {
  @apply px-6 py-3 text-lg;
}
```

---

## Complex Selectors

Use standard CSS selectors for complex targeting:

```css
/* Table.module.css */
.table {
  @apply w-full border-collapse;
}

.table thead {
  @apply bg-gray-50;
}

.table tbody tr:nth-child(even) {
  @apply bg-gray-50;
}

.table tbody tr:hover {
  @apply bg-blue-50;
}

.table tbody tr:hover td {
  @apply text-blue-900;
}
```

---

## Pseudo-elements and Pseudo-classes

```css
/* Input.module.css */
.input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-lg;
}

.input::placeholder {
  @apply text-gray-400 italic;
}

.input:focus {
  @apply outline-none ring-2 ring-blue-500 border-blue-500;
}

.input:disabled {
  @apply bg-gray-100 cursor-not-allowed;
}
```

---

## Animations

Define animations with standard CSS, apply with `@apply`:

```css
/* Spinner.module.css */
.spinner {
  @apply w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

---

## Global Styles

Only use `globals.css` for true global styles:

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900 antialiased;
  }
}
```

**Do NOT add component styles to `globals.css`** - each component gets its own module.

---

## Third-Party Component Overrides

Use `:global()` to target third-party component classes:

```css
/* Select.module.css */
.container :global(.react-select__control) {
  @apply border-2 border-gray-300 rounded-lg;
}

.container :global(.react-select__control--is-focused) {
  @apply border-blue-500 ring-2 ring-blue-500;
}
```

---

## shadcn/ui Components

**This project uses shadcn/ui as the component library.**

When working with shadcn components:

1. **Always check Context7 for the latest shadcn documentation** before implementing
2. **shadcn components come with their own styles** - you can override them in your module:

```css
/* Form.module.css */
.formField :global(.shadcn-input) {
  @apply border-2 border-blue-300;
}

.formField :global(.shadcn-label) {
  @apply text-sm font-semibold text-gray-700;
}
```

3. **Import shadcn components as documented in Context7:**

```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import styles from './LoginForm.module.css'

export function LoginForm() {
  return (
    <form className={styles.form}>
      <Input className={styles.input} />
      <Button className={styles.submitButton}>Submit</Button>
    </form>
  )
}
```

4. **Use Context7 to verify** component props, variants, and customization options

---

## Composition Pattern

Create shared base classes and compose them:

```css
/* Card.module.css */
.card {
  @apply bg-white rounded-xl border border-gray-200;
  @apply shadow-lg transition-all duration-200;
}

.cardElevated {
  @apply bg-white rounded-xl border border-gray-200;
  @apply shadow-2xl hover:shadow-3xl transition-all duration-200;
}

.header {
  @apply p-6 border-b border-gray-200;
}

.body {
  @apply p-6;
}

.footer {
  @apply p-6 border-t border-gray-200 bg-gray-50;
}
```

```tsx
// Card.tsx
import styles from './Card.module.css'

export function Card({ elevated, children }: { elevated?: boolean, children: React.ReactNode }) {
  return (
    <div className={elevated ? styles.cardElevated : styles.card}>
      {children}
    </div>
  )
}

Card.Header = ({ children }: { children: React.ReactNode }) => (
  <div className={styles.header}>{children}</div>
)

Card.Body = ({ children }: { children: React.ReactNode }) => (
  <div className={styles.body}>{children}</div>
)

Card.Footer = ({ children }: { children: React.ReactNode }) => (
  <div className={styles.footer}>{children}</div>
)
```

---

## Custom CSS When Tailwind Doesn't Cover It

Use raw CSS only when Tailwind doesn't provide the utility:

```css
/* Scrollable.module.css */
.container {
  @apply overflow-y-auto;
  
  /* Custom scrollbar styles - not available in Tailwind */
  scrollbar-width: thin;
  scrollbar-color: #CBD5E0 #F7FAFC;
}

.container::-webkit-scrollbar {
  width: 8px;
}

.container::-webkit-scrollbar-track {
  @apply bg-gray-100;
}

.container::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded-full;
}
```

---

## Checklist for Every Component

- [ ] Created `ComponentName.module.css` file
- [ ] Imported styles at top of component file
- [ ] Used only `styles.className` in JSX (no inline Tailwind)
- [ ] Used camelCase for all class names
- [ ] Used `@apply` for all Tailwind utilities
- [ ] Used `cn()` utility for conditional classes
- [ ] Organized CSS: base → variants → children → states

---

## Quick Reference

| Do This | Not This |
|---------|----------|
| `<div className={styles.container}>` | `<div className="flex items-center">` |
| `Button.module.css` | `Button.css` |
| `.buttonPrimary` | `.button-primary` |
| `@apply px-4 py-2` | `padding: 1rem 0.5rem;` |
| Use `cn()` for conditionals | String template conditionals |

---

## Files to Create Once

These utility files should exist in your project:

**`lib/utils.ts`** - Create this first
```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**`app/globals.css`** - Already exists
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900 antialiased;
  }
}
```

**Dependencies to install:**
```bash
pnpm add clsx tailwind-merge
```