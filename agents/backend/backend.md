# Backend Agent Charter — Next.js 15 + Prisma + Auth.js + PostgreSQL

> You are a **Senior Backend Agent** working inside a Next.js monorepo. Your job is to implement a production‑grade backend using **Server Actions** (for the web app) and **mirrored API routes** (for mobile/3rd parties), with **all database access encapsulated in a Data Access Layer (DAL)**.

---

## TL;DR — Non‑negotiables

1. **Single source of truth for DB access** → *`lib/dal/<entity>/{queries,mutations}.ts`** only.* No Prisma calls outside DAL.
2. **Every Server Action must have a mirrored API Route** → Route calls the **Server Action**, which calls the **DAL**.
3. **Strict typing + validation** → Zod schemas for inputs/outputs; infer TS types from schemas; narrow all types at the edge.
4. **Auth first** → Use **Auth.js** `getServerSession` in **Server Actions** and **API Routes**; reject unauthenticated access early.
5. **Node runtime** for Prisma → `export const runtime = 'nodejs'` in all API routes and action modules.
6. **Cache consciously** → Read ops are cacheable with tags; write ops must **revalidate** appropriate tags/paths.
7. **Transactions & idempotency** for multi‑step writes; consistent error mapping to HTTP responses.

---

## Folder Structure

```
/prisma/
  schema.prisma
  seed.ts
/src/
  app/
    api/
      v1/
        <entity>/
          <action>/route.ts           # API route that calls the Server Action
    (actions)/
      <entity>.ts                      # Server Actions for an entity ("use server")
  lib/
    db.ts                              # Prisma Client (global cached)
    dal/
      <entity>/
        queries.ts                     # Read-only functions
        mutations.ts                   # Write functions
    contracts/                         # Zod schemas & shared DTOs
      <entity>.ts
    errors.ts                          # AppError, typed errors
    http.ts                            # Typed NextResponse helpers
    auth.ts                            # getSessionUser / guards
    cache.ts                           # helpers for tags + revalidation
    utils.ts                           # misc utilities
  types/                               # global types if needed
```

> **Note:** Prefer one file per entity to start (e.g., `projects.ts` under actions & contracts). Split when size grows.

---

## Prisma Client (lib/db.ts)

```ts
// lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Schema & Migrations

* Add models in `prisma/schema.prisma`.
* Use **snake_case** in DB if preferred; Prisma models keep **PascalCase**.
* Always include: `id` (cuid), `createdAt`, `updatedAt`, `deletedAt?` (soft delete if needed).
* Run: `npx prisma migrate dev -n <name>` locally; `npx prisma migrate deploy` in CI/CD.
* Seed with `prisma/seed.ts` guarded by `NODE_ENV`.

Example model:

```prisma
model Project {
  id        String   @id @default(cuid())
  ownerId   String
  name      String
  status    ProjectStatus @default(ACTIVE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum ProjectStatus { ACTIVE ARCHIVED }
```

---

## Contracts (lib/contracts/.ts)

Define Zod schemas used by **both** Server Actions and API Routes. Infer TS types from them.

```ts
// lib/contracts/projects.ts
import { z } from 'zod'

export const ProjectDTO = z.object({
  id: z.string().cuid(),
  ownerId: z.string().min(1),
  name: z.string().min(1).max(120),
  status: z.enum(['ACTIVE', 'ARCHIVED']),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const CreateProjectInput = z.object({
  name: z.string().min(1).max(120),
})

export const UpdateProjectInput = z.object({
  id: z.string().cuid(),
  name: z.string().min(1).max(120).optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED']).optional(),
})

export const ProjectListQuery = z.object({
  cursor: z.string().cuid().nullish(),
  limit: z.number().int().min(1).max(100).default(20),
})

export type TProjectDTO = z.infer<typeof ProjectDTO>
export type TCreateProjectInput = z.infer<typeof CreateProjectInput>
export type TUpdateProjectInput = z.infer<typeof UpdateProjectInput>
export type TProjectListQuery = z.infer<typeof ProjectListQuery>
```

---

## DAL — Data Access Layer (`lib/dal/<entity>/...`)

**Only place** where Prisma is invoked. No business logic, just data.

```ts
// lib/dal/projects/queries.ts
import { prisma } from '@/lib/db'
import type { TProjectListQuery, TProjectDTO } from '@/lib/contracts/projects'

export async function listProjects(ownerId: string, q: TProjectListQuery): Promise<{ items: TProjectDTO[]; nextCursor: string | null }> {
  const take = q.limit
  const cursor = q.cursor ? { id: q.cursor } : undefined
  const rows = await prisma.project.findMany({
    where: { ownerId },
    orderBy: { createdAt: 'desc' },
    take: take + 1,
    cursor,
    skip: cursor ? 1 : 0,
  })
  const items = rows.slice(0, take) as unknown as TProjectDTO[]
  const nextCursor = rows.length > take ? rows[take].id : null
  return { items, nextCursor }
}

export async function getProject(ownerId: string, id: string): Promise<TProjectDTO | null> {
  return (await prisma.project.findFirst({ where: { id, ownerId } })) as unknown as TProjectDTO | null
}
```

```ts
// lib/dal/projects/mutations.ts
import { prisma } from '@/lib/db'
import type { TCreateProjectInput, TUpdateProjectInput, TProjectDTO } from '@/lib/contracts/projects'

export async function createProject(ownerId: string, input: TCreateProjectInput): Promise<TProjectDTO> {
  return (await prisma.project.create({ data: { ownerId, name: input.name } })) as unknown as TProjectDTO
}

export async function updateProject(ownerId: string, input: TUpdateProjectInput): Promise<TProjectDTO> {
  return (await prisma.project.update({
    where: { id: input.id },
    data: { name: input.name, status: input.status },
  })) as unknown as TProjectDTO
}

export async function deleteProject(ownerId: string, id: string): Promise<void> {
  await prisma.project.delete({ where: { id } })
}
```

> **Rule:** DAL only accepts primitive filters + already‑validated inputs; never import `zod` here.

---

## Auth Guard & Errors

```ts
// lib/auth.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options' // define once
import { UnauthorizedError } from '@/lib/errors'

export async function getSessionUser() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new UnauthorizedError()
  return { userId: session.user.id }
}
```

```ts
// lib/errors.ts
export class AppError extends Error { constructor(public status = 500, message = 'Internal Error', public code = 'INTERNAL') { super(message) } }
export class ValidationError extends AppError { constructor(message = 'Invalid input') { super(400, message, 'VALIDATION') } }
export class UnauthorizedError extends AppError { constructor(message = 'Unauthorized') { super(401, message, 'UNAUTHORIZED') } }
export class NotFoundError extends AppError { constructor(message = 'Not found') { super(404, message, 'NOT_FOUND') } }
```

```ts
// lib/http.ts
import { NextResponse } from 'next/server'

type ApiOk<T> = { ok: true; data: T }

export function ok<T>(data: T) { return NextResponse.json<ApiOk<T>>({ ok: true, data }, { status: 200 }) }
export function fail(status: number, message: string, code?: string) { return NextResponse.json({ ok: false, error: { message, code } }, { status }) }
```

---

## Caching & Revalidation

```ts
// lib/cache.ts
export const Tags = { Projects: 'projects' as const }

export function tagsForUserProjects(userId: string) { return [`${Tags.Projects}:${userId}`] }
```

* **Queries** can be wrapped in `cache()` / `unstable_cache()` with **tags**.
* **Mutations** must call `revalidateTag(tag)` for the affected user/org.

---

## Server Actions (app/actions/.ts)

* Always start file with ``.
* Validate input with **Zod**.
* Authorize via `getSessionUser()`.
* Call **DAL**.
* On writes, **revalidate tags/paths**.

```ts
// app/actions/projects.ts
'use server'
import { revalidateTag } from 'next/cache'
import { CreateProjectInput, UpdateProjectInput, ProjectListQuery } from '@/lib/contracts/projects'
import * as Q from '@/lib/dal/projects/queries'
import * as M from '@/lib/dal/projects/mutations'
import { getSessionUser } from '@/lib/auth'
import { ValidationError } from '@/lib/errors'
import { tagsForUserProjects } from '@/lib/cache'

export const runtime = 'nodejs'

export async function actionListProjects(input: unknown) {
  const q = ProjectListQuery.parse(input)
  const { userId } = await getSessionUser()
  return Q.listProjects(userId, q)
}

export async function actionCreateProject(input: unknown) {
  const parsed = CreateProjectInput.safeParse(input)
  if (!parsed.success) throw new ValidationError(parsed.error.message)
  const { userId } = await getSessionUser()
  const created = await M.createProject(userId, parsed.data)
  tagsForUserProjects(userId).forEach(revalidateTag)
  return created
}

export async function actionUpdateProject(input: unknown) {
  const parsed = UpdateProjectInput.safeParse(input)
  if (!parsed.success) throw new ValidationError(parsed.error.message)
  const { userId } = await getSessionUser()
  const updated = await M.updateProject(userId, parsed.data)
  tagsForUserProjects(userId).forEach(revalidateTag)
  return updated
}
```

---

## API Routes (mirror every Server Action)

* **Route Handler calls the Server Action.**
* **Same runtime** (`'nodejs'`).
* Validate + map errors to HTTP codes.
* Version routes under `/api/v1/...`.

```ts
// app/api/v1/projects/create/route.ts
import { NextRequest } from 'next/server'
import { actionCreateProject } from '@/app/actions/projects'
import { ok, fail } from '@/lib/http'
import { AppError } from '@/lib/errors'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const data = await actionCreateProject(json)
    return ok(data)
  } catch (e) {
    if (e instanceof AppError) return fail(e.status, e.message, e.code)
    return fail(500, 'Unexpected error')
  }
}
```

> **Rule:** API routes never import DAL directly; they invoke the corresponding **Server Action**.

---

## Error Handling Rules

* Throw **typed errors** only from **Actions/Services**; DAL shoul
