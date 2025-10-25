# Flujo de Onboarding - Luka

## Descripción General

El flujo de onboarding permite a nuevos usuarios configurar su cuenta antes de autenticarse con Google. Los datos se guardan en cookies seguras y se procesan después de la autenticación exitosa.

## Flujo Paso a Paso

### 1. Usuario completa los pasos del onboarding

**Paso 1**: Selección de estrategia financiera
- El usuario elige entre: Recomendado, Conservador, Ahorrador, o Inversionista
- Se guarda en Zustand store

**Paso 2**: Configuración de fuente inicial
- El usuario configura su primera fuente de dinero (Efectivo, Cuenta Bancaria, o Tarjeta)
- Se guarda en Zustand store

**Paso 3**: Revisión y autenticación
- El usuario ve un resumen de su configuración
- Click en "Continuar con Google"

### 2. Guardado de datos en cookies

**Archivo**: `src/actions/onboarding/save-data.ts`

Cuando el usuario hace click en "Continuar con Google":

1. Se ejecuta `handleBeforeSignIn()` en `Step3Login.tsx`
2. Se validan los datos del source
3. Se llama a `actionSaveOnboardingData()` para guardar en cookies:
   ```typescript
   {
     source: {
       name: string,
       type: "CASH" | "BANK_ACCOUNT" | "CARD",
       subtype?: "SAVINGS" | "CHECKING" | "DEBIT_CARD" | "CREDIT_CARD",
       balance: number,
       color: string,
       sourceNumber?: string
     },
     strategy: "RECOMMENDED" | "CONSERVATIVE" | "SAVER" | "INVESTOR"
   }
   ```
4. Las cookies son:
   - `httpOnly: true` (seguras, no accesibles desde JavaScript)
   - `maxAge: 600` (10 minutos de expiración)
   - `sameSite: "lax"`

### 3. Autenticación con Google

**Archivo**: `src/components/LoginForm/LoginForm.tsx`

Después de guardar las cookies:
1. Se ejecuta `signIn("google", { callbackUrl: "/onboarding/complete" })`
2. El usuario es redirigido a Google para autenticarse
3. Auth.js crea la cuenta/sesión del usuario
4. Auth.js redirige al usuario a `/onboarding/complete`

### 4. Procesamiento post-autenticación

**Archivos**: 
- `src/app/onboarding/complete/page.tsx` (página)
- `src/actions/onboarding/complete-after-auth.ts` (Server Action)

La página invoca una Server Action que:
1. Verifica que el usuario esté autenticado
2. Lee las cookies con `getOnboardingData()`
3. Crea el source y el UserProfile en una transacción:
   ```typescript
   await prisma.$transaction(async (tx) => {
     // Crear source inicial
     await tx.source.create({...})
     
     // Crear o actualizar UserProfile
     await tx.userProfile.upsert({...})
   })
   ```
4. Limpia las cookies con `clearOnboardingData()` (solo permitido en Server Actions)
5. Redirige al usuario al dashboard

**Nota importante**: La modificación de cookies solo está permitida en Server Actions o Route Handlers, no en Server Components directamente. Por eso la lógica está en `complete-after-auth.ts`.

### 5. Protección del middleware

**Archivo**: `src/middleware.ts`

El middleware permite que `/onboarding/complete`:
- Sea accesible para usuarios autenticados
- No redirija automáticamente al dashboard
- Procese los datos del onboarding antes de la redirección final

## Archivos Clave

### Nuevos archivos
- `src/lib/cookies.ts` - Utilidades para manejar cookies del onboarding
- `src/actions/onboarding/save-data.ts` - Server Action para guardar datos en cookies
- `src/actions/onboarding/complete-after-auth.ts` - Server Action para completar onboarding después de auth
- `src/app/onboarding/complete/page.tsx` - Página que invoca la Server Action de completado

### Archivos modificados
- `src/components/OnboardingWizard/OnboardingSteps/Step3Login.tsx`
- `src/components/LoginForm/LoginForm.tsx`
- `src/components/LoginForm/LoginForm.types.ts`
- `src/middleware.ts`

## Ventajas de este enfoque

1. **Seguridad**: Los datos se guardan en cookies httpOnly
2. **Atomicidad**: Se usa una transacción de Prisma para garantizar consistencia
3. **UX**: El usuario no necesita reintroducir datos después de autenticarse
4. **Manejo de errores**: Si algo falla, las cookies se limpian automáticamente
5. **Timeout**: Las cookies expiran en 10 minutos para evitar datos huérfanos

## Manejo de Errores

### Si el usuario no se autentica
- Las cookies expiran automáticamente en 10 minutos
- No se crea ningún registro en la base de datos

### Si falla la creación del source/profile
- Las cookies se limpian automáticamente
- El usuario es redirigido al dashboard
- El error se registra en los logs del servidor

### Si el usuario ya tiene un profile
- Se actualiza el profile existente con `upsert()`
- Se crea el nuevo source normalmente

## Testing

Los tests existentes siguen funcionando:
- ✅ 41/41 tests pasando
- ✅ DAL tests (Sources y UserProfile)
- ✅ Server Actions tests (Onboarding)
- ✅ Build exitoso

## Próximos Pasos

1. Verificar el flujo manualmente:
   - Ir a `/onboarding`
   - Completar los 3 pasos
   - Autenticarse con Google
   - Verificar redirección al dashboard
   - Verificar que el source y profile se crearon

2. Agregar tests para:
   - `actionSaveOnboardingData`
   - `/onboarding/complete` page logic
   - Cookie utilities

