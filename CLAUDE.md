# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 project using the App Router architecture with TypeScript, Tailwind CSS v4, and Biome for linting and formatting. The project uses Auth.js (NextAuth.js v5) for authentication, Prisma as the ORM, and follows strict architectural patterns for data access, component structure, and testing.

## Package Manager

**ALWAYS use pnpm, never npm or yarn:**
```bash
pnpm install
pnpm add <package>
pnpm dlx <command>  # Instead of npx
```

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

### Database (Prisma)
```bash
# Generate Prisma Client after schema changes
pnpm dlx prisma generate

# Run database migrations
pnpm dlx prisma migrate dev

# Open Prisma Studio
pnpm dlx prisma studio

# Reset database (caution!)
pnpm dlx prisma migrate reset
```

### Code Quality
```bash
# Run Biome linter and formatter checks
pnpm lint

# Auto-format code with Biome
pnpm format

# TypeScript type checking
pnpm dlx tsc --noEmit
```

### Testing
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run test coverage
pnpm test:coverage
```

## Core Technologies

- **Next.js 15** with App Router and Turbopack
- **React 19** for UI components
- **TypeScript** with strict mode enabled
- **Tailwind CSS v4** with CSS Modules (no inline utilities)
- **Biome** for linting, formatting, and import organization
- **Prisma** as the database ORM
- **Auth.js (NextAuth.js v5)** for authentication
- **Zod** for schema validation
- **Resend** for email sending
- **Framer Motion** for animations
- **Zustand** for global state management
- **shadcn/ui** as component library
- **pnpm** as the package manager

## Architecture & Patterns

### Directory Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth route group
│   ├── api/                 # API routes
│   ├── layout.tsx
│   └── page.tsx
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   └── [ComponentName]/
│       ├── ComponentName.tsx
│       ├── ComponentName.module.css
│       ├── ComponentName.types.ts
│       ├── ComponentName.test.tsx
│       └── ComponentNameSkeleton.tsx
├── lib/
│   ├── dal/                 # Data Access Layer
│   │   └── [tableName]/
│   │       ├── queries.ts
│   │       ├── mutations.ts
│   │       └── [tableName].types.ts
│   ├── prisma.ts           # Prisma client instance
│   └── utils.ts
├── actions/                 # Server Actions
│   └── [feature]/
│       ├── actions.ts
│       ├── actions.types.ts
│       └── actions.test.ts
├── types/                   # Global TypeScript types
└── auth.ts                  # Auth.js configuration
```

### Type Files Convention

**MANDATORY: Every component, page, API endpoint, and DAL that has ANY types (interfaces, types, enums, constants) MUST have a corresponding `.types.ts` file.**

**This rule applies to:**
- ✅ All components (even if they only have props)
- ✅ All pages with types
- ✅ All API endpoints with types
- ✅ All DAL functions with types
- ✅ All server actions with types
- ✅ All utilities with types
- ✅ All stores with types
- ✅ **Zod schemas MUST go in `.types.ts` files**
- ✅ **Constants MUST go in `.constants.ts` files**

**NEVER define types, schemas, or constants inline in the main file unless it's a trivial local variable.**

**Structure:**
```
Button/
├── Button.tsx              # NO types, NO constants
├── Button.module.css
├── Button.types.ts         # ← ALL types, interfaces, enums, Zod schemas
├── Button.constants.ts     # ← ALL constants (if needed)
├── Button.test.tsx
└── ButtonSkeleton.tsx

Step2Source/
├── Step2Source.tsx         # NO types, NO constants
├── Step2Source.module.css
├── Step2Source.types.ts    # ← Props, types, Zod schemas
├── Step2Source.constants.ts # ← COLORS, OPTIONS, etc.
└── Step2Source.test.tsx

lib/dal/users/
├── queries.ts              # NO types
├── mutations.ts            # NO types
└── users.types.ts          # ← ALL DAL-related types

actions/auth/
├── actions.ts              # NO types, NO schemas
├── actions.types.ts        # ← ALL action types, Zod schemas, inputs
└── actions.test.ts

store/
├── useCartStore.ts         # NO types
└── useCartStore.types.ts   # ← ALL store types
```

**Example - WRONG:**
```typescript
// LoginForm.tsx - ❌ WRONG - types, schemas, and constants in component
import { z } from 'zod'

const MAX_LENGTH = 100

const loginSchema = z.object({
  email: z.string().email()
})

interface LoginFormProps {
  onSubmit: () => void
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  // ...
}
```

**Example - CORRECT:**
```typescript
// LoginForm.constants.ts - ✅ CORRECT
export const MAX_LENGTH = 100

// LoginForm.types.ts - ✅ CORRECT
import { z } from 'zod'
import type { ReactNode } from 'react'

export const loginSchema = z.object({
  email: z.string().email()
})

export type LoginFormValues = z.infer<typeof loginSchema>

export interface LoginFormProps {
  onSubmit: () => void
}

// LoginForm.tsx - ✅ CORRECT
import type { LoginFormProps, LoginFormValues } from './LoginForm.types'
import { loginSchema } from './LoginForm.types'
import { MAX_LENGTH } from './LoginForm.constants'

export function LoginForm({ onSubmit }: LoginFormProps) {
  // ...
}
```

### Data Access Layer (DAL)

**ALL database interactions MUST go through the DAL. Never use Prisma directly in components, pages, or actions.**

Create a folder for each Prisma table in `src/lib/dal/`:

```typescript
// src/lib/dal/users/queries.ts
import { prisma } from '@/lib/prisma'
import type { UserWithPosts } from './users.types'

export async function getUserById(id: string): Promise<UserWithPosts | null> {
  return await prisma.user.findUnique({
    where: { id },
    include: { posts: true }
  })
}

export async function getAllUsers() {
  return await prisma.user.findMany()
}
```

```typescript
// src/lib/dal/users/mutations.ts
import { prisma } from '@/lib/prisma'
import type { CreateUserInput, UpdateUserInput } from './users.types'

export async function createUser(data: CreateUserInput) {
  return await prisma.user.create({ data })
}

export async function updateUser(id: string, data: UpdateUserInput) {
  return await prisma.user.update({
    where: { id },
    data
  })
}
```

```typescript
// src/lib/dal/users/users.types.ts
import type { User, Post } from '@prisma/client'

export type UserWithPosts = User & {
  posts: Post[]
}

export type CreateUserInput = {
  email: string
  name: string
}

export type UpdateUserInput = Partial<CreateUserInput>
```

### Server Actions

**NEVER define functions inside components. Import from `/actions` directory.**

```typescript
// src/actions/auth/actions.ts
'use server'

import { signIn } from '@/auth'
import type { LoginInput } from './actions.types'

export async function loginAction(input: LoginInput) {
  // Implementation
}
```

```typescript
// src/components/LoginForm/LoginForm.tsx
import { loginAction } from '@/actions/auth/actions'
import styles from './LoginForm.module.css'

export function LoginForm() {
  return (
    <form action={loginAction} className={styles.form}>
      {/* form fields */}
    </form>
  )
}
```

### Constants

**All constants MUST be in UPPER_CASE:**

```typescript
// ✅ CORRECT
const MAX_FILE_SIZE = 5000000
const API_BASE_URL = 'https://api.example.com'
const DEFAULT_PAGE_SIZE = 10

// ❌ WRONG
const maxFileSize = 5000000
const apiBaseUrl = 'https://api.example.com'
```

### Component Patterns

#### Server Components (Default)

**NEVER use 'use client' in page files. Pages MUST always be Server Components.**

If you need client-side functionality (useState, useEffect, event handlers, etc.), create a separate component with 'use client' and import it into the page.

```tsx
// ❌ WRONG - Never do this in a page
'use client'

import { useState } from 'react'

export default function UsersPage() {
  const [count, setCount] = useState(0)
  return <div>Count: {count}</div>
}
```

```tsx
// ✅ CORRECT - Page is Server Component
// src/app/users/page.tsx
import { Suspense } from 'react'
import { UserList } from '@/components/UserList/UserList'
import { UserListSkeleton } from '@/components/UserList/UserListSkeleton'

export default function UsersPage() {
  return (
    <div>
      <h1>Users</h1>
      <Suspense fallback={<UserListSkeleton />}>
        <UserList />
      </Suspense>
    </div>
  )
}
```

```tsx
// ✅ CORRECT - Client component is separate
// src/components/Counter/Counter.tsx
'use client'

import { useState } from 'react'
import styles from './Counter.module.css'

export function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div className={styles.container}>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  )
}

// Then import in page:
// src/app/dashboard/page.tsx
import { Counter } from '@/components/Counter/Counter'

export default function DashboardPage() {
  return <Counter />
}
```

#### Data Fetching Pattern

**When fetching data, create a separate component that calls the DAL function. Wrap it with Suspense:**

```tsx
// src/components/UserList/UserList.tsx
import { getAllUsers } from '@/lib/dal/users/queries'
import { UserCard } from './UserCard'
import styles from './UserList.module.css'

export async function UserList() {
  const users = await getAllUsers()
  
  return (
    <div className={styles.list}>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}
```

```tsx
// src/components/UserList/UserListSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton'
import styles from './UserList.module.css'

export function UserListSkeleton() {
  return (
    <div className={styles.list}>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className={styles.skeletonCard} />
      ))}
    </div>
  )
}
```

#### Client Components with Data Fetching

**Use the `use()` hook, NOT `useEffect()` for data fetching:**

```tsx
'use client'

import { use } from 'react'
import type { User } from '@/types'
import styles from './UserProfile.module.css'

interface UserProfileProps {
  userPromise: Promise<User>
}

export function UserProfile({ userPromise }: UserProfileProps) {
  const user = use(userPromise)
  
  return (
    <div className={styles.profile}>
      <h2>{user.name}</h2>
    </div>
  )
}
```

### Skeleton Components

**Every component that fetches data or displays async content MUST have a corresponding skeleton component:**

- Use the `Skeleton` component from shadcn/ui
- Name it `[ComponentName]Skeleton.tsx`
- Match the layout structure of the actual component
- Use it as the Suspense fallback

```tsx
// src/components/ProductCard/ProductCardSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton'
import styles from './ProductCard.module.css'

export function ProductCardSkeleton() {
  return (
    <div className={styles.card}>
      <Skeleton className={styles.image} />
      <Skeleton className={styles.title} />
      <Skeleton className={styles.price} />
    </div>
  )
}
```

### Global State Management

**Use Zustand for global state:**

```typescript
// src/store/useCartStore.ts
import { create } from 'zustand'

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ 
    items: [...state.items, item] 
  })),
  removeItem: (id) => set((state) => ({ 
    items: state.items.filter(item => item.id !== id) 
  }))
}))
```

### Authentication (Auth.js)

```typescript
// src/auth.ts
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  // ... configuration
})
```

**Environment Variables Required:**
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `AUTH_SECRET`

### Email (Resend)

```typescript
// src/lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(to: string, name: string) {
  await resend.emails.send({
    from: 'onboarding@example.com',
    to,
    subject: 'Welcome!',
    html: `<p>Welcome, ${name}!</p>`
  })
}
```

### Validation (Zod)

**Use Zod for all data validation:**

```typescript
// src/actions/auth/actions.types.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export type LoginInput = z.infer<typeof loginSchema>
```

### Animations (Framer Motion)

```tsx
'use client'

import { motion } from 'framer-motion'
import styles from './Card.module.css'

export function Card() {
  return (
    <motion.div 
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      Content
    </motion.div>
  )
}
```

## Styling

**See `agents/frontend/styling.md` for complete CSS Modules guidelines.**

Key points:
- NO Tailwind utilities in JSX
- Every component has `.module.css` file
- Use `@apply` for Tailwind utilities in CSS Modules
- Biome is configured to allow `@apply` without errors

## Testing Requirements

**EVERY component, DAL function, server action, and API endpoint MUST have tests.**

### Component Tests
```typescript
// src/components/Button/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

### DAL Tests
```typescript
// src/lib/dal/users/queries.test.ts
import { getUserById } from './queries'

describe('getUserById', () => {
  it('returns user with posts', async () => {
    const user = await getUserById('user-1')
    expect(user).toBeDefined()
    expect(user?.posts).toBeInstanceOf(Array)
  })
})
```

## Documentation & Context7

**ALWAYS use Context7 to check library documentation when:**
- Implementing shadcn/ui components
- Using Framer Motion animations
- Working with Prisma schemas
- Using Auth.js features
- Using Tailwind utilities
- Any other library-specific implementation

**Never guess API details - check Context7 first.**

## Code Quality Rules

1. **TypeScript**: Strict mode enabled, no `any` types
2. **Biome**: All code must pass Biome checks before commit
3. **Testing**: All new code must include tests
4. **MANDATORY .types.ts Files**: EVERY component, store, DAL, action, or utility with types MUST have a separate `.types.ts` file. NO exceptions.
5. **Constants**: Always UPPER_CASE
6. **DAL Only**: Never use Prisma directly outside DAL
7. **No Component Functions**: Import from `/actions`
8. **NO 'use client' in Pages**: Pages MUST be Server Components. Wrap client components separately.
9. **Suspense + Skeleton**: Required for all async components
10. **use() over useEffect**: For data fetching in client components
11. **Component Size Limit**: Keep components under 250 lines. Split into smaller components if needed.
12. **Single @apply per Rule**: Use one `@apply` statement with all classes, not multiple lines.

## Common Pitfalls to Avoid

❌ Using `npx` instead of `pnpm dlx`
❌ Inline Tailwind classes in JSX
❌ Functions defined inside components
❌ Using Prisma directly in components/actions
❌ Missing `.types.ts` files
❌ Using 'use client' in page files (NEVER do this - wrap components instead)
❌ Missing skeleton components for async data
❌ Using `useEffect` for data fetching (use `use()` instead)
❌ lowercase or camelCase constants
❌ Missing tests for new code

## Environment Variables

Create `.env.local` with:
```
# Database
DATABASE_URL="postgresql://..."

# Auth.js
AUTH_SECRET="..."
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."

# Resend
RESEND_API_KEY="..."
```

## Additional Resources

- Next.js 15 Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- Auth.js Docs: https://authjs.dev
- shadcn/ui: https://ui.shadcn.com
- Framer Motion: https://www.framer.com/motion
- Biome: https://biomejs.dev