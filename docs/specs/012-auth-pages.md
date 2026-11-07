# SPEC-012: app/sign-in + app/sign-up — Páginas de autenticación de Clerk

**ID:** SPEC-012
**Fecha:** 2026-11-07
**Autor:** human
**Estado:** BORRADOR
**Prioridad:** ALTA
**Clasificación:** SIMPLE

---

## Contexto

### Por qué
Al acceder a `/projects` sin sesión, Clerk redirige a `/sign-in`. Esa ruta devuelve 404 porque no existe la página. Los usuarios no pueden autenticarse ni usar la aplicación.

### Qué problema resuelve
Estado actual: `/sign-in` y `/sign-up` devuelven 404 — la app es inutilizable sin sesión activa.
Estado deseado: ambas rutas renderizan los componentes de Clerk correspondientes; tras sign-in exitoso el usuario llega a `/projects`.

### Decisiones de BRAIN.md consultadas
- [x] Clerk es la capa de auth — usar sus componentes hosted (`<SignIn />`, `<SignUp />`)
- [x] App Router — las páginas van en `app/sign-in/[[...sign-in]]/page.tsx` (patrón Clerk catch-all)
- [x] No `any` en TypeScript
- [x] `'use client'` solo cuando necesario — `<SignIn />` y `<SignUp />` son Client Components de Clerk

---

## Criterios de Aceptación

1. DADO un usuario no autenticado
   CUANDO accede a cualquier ruta del grupo `(auth)` (ej. `/projects`)
   ENTONCES es redirigido a `/sign-in` y ve el formulario de Clerk (no 404)

2. DADO el formulario de sign-in visible
   CUANDO el usuario completa credenciales válidas
   ENTONCES es redirigido a `/projects` tras autenticación exitosa

3. DADO un usuario no autenticado en `/sign-up`
   CUANDO accede a esa URL
   ENTONCES ve el formulario de registro de Clerk (no 404)

4. DADO un usuario ya autenticado
   CUANDO accede a `/sign-in` o `/sign-up`
   ENTONCES Clerk lo redirige automáticamente a `/projects` (comportamiento nativo del componente)

---

## Alcance

### Incluido
- `app/sign-in/[[...sign-in]]/page.tsx` — renderiza `<SignIn />`
- `app/sign-up/[[...sign-up]]/page.tsx` — renderiza `<SignUp />`
- Variables de entorno en `.env.local` y `.env.example`: `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL`, `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`

### EXPLÍCITAMENTE EXCLUIDO
- Estilos/customización de los formularios de Clerk — spec futura de UI
- Tests unitarios — `<SignIn />` y `<SignUp />` son componentes de terceros sin lógica propia a testear
- Tests e2e del flujo completo — depende de SPEC-013+ (Playwright setup)
- Página de error de autenticación o manejo de errores custom
- Redirect condicional post-login según rol o estado del usuario

---

## Subtareas

| # | Descripción | Criterio de verificación | Estimación |
|---|-------------|--------------------------|------------|
| 1 | Crear `app/sign-in/[[...sign-in]]/page.tsx` con `<SignIn />` | `localhost:3001/sign-in` muestra formulario Clerk sin 404 | 0.10h |
| 2 | Crear `app/sign-up/[[...sign-up]]/page.tsx` con `<SignUp />` | `localhost:3001/sign-up` muestra formulario Clerk sin 404 | 0.10h |
| 3 | Agregar vars de entorno a `.env.local` y `.env.example` | Sign-in exitoso redirige a `/projects` | 0.10h |

---

## Decisiones de Diseño Ya Tomadas

- Ruta catch-all `[[...sign-in]]`: requerida por Clerk para manejar sub-rutas del flujo OAuth (callbacks, MFA, etc.)
- `afterSignInUrl=/projects` y `afterSignUpUrl=/projects`: destino post-auth es la única ruta protegida actual
- Sin layout propio para sign-in/sign-up: Clerk centra el componente por defecto; layout personalizado es UI iteration posterior
- No `'use client'` en las páginas: `<SignIn />` y `<SignUp />` son Client Components internamente; las páginas pueden ser Server Components que los renderizan

---

## Archivos Esperados a Modificar

- `app/sign-in/[[...sign-in]]/page.tsx` ← nuevo
- `app/sign-up/[[...sign-up]]/page.tsx` ← nuevo
- `.env.local` ← agregar 4 vars (no commitear)
- `.env.example` ← agregar 4 vars con valores placeholder

---

## Dependencias

- [x] SPEC-009: Clerk foundation (middleware + ClerkProvider) — completada
- [ ] Esta spec debe completarse antes de cualquier test e2e de autenticación
