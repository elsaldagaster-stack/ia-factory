# SPEC-009: Clerk foundation — middleware + layouts

**ID:** SPEC-009
**Fecha:** 2026-11-06
**Autor:** human
**Estado:** APROBADA
**Prioridad:** ALTA
**Clasificación:** SIMPLE

---

## Contexto

### Por qué
Con SPEC-008 las Server Actions existen pero no hay rutas que las consuman. Antes de crear cualquier página se necesitan: (1) el middleware de Clerk para que las sesiones estén disponibles en toda la app, (2) un root layout con `ClerkProvider`, y (3) un layout para el grupo `(auth)` que redirija usuarios no autenticados.

### Qué problema resuelve
Estado actual: `app/` solo tiene `app/actions/`. No existe `middleware.ts`, ni `app/layout.tsx`, ni grupo `(auth)`.
Estado deseado: tres archivos de fundación que permiten crear páginas protegidas en pasos siguientes.

### Decisiones de BRAIN.md consultadas
- [x] Proteger rutas con `clerkMiddleware()` en `middleware.ts`
- [x] `auth()` de `@clerk/nextjs/server` para verificar sesión en Server Components
- [x] Server Components por defecto — `app/(auth)/layout.tsx` es async Server Component

---

## Criterios de Aceptación

1. DADO cualquier request a la app
   CUANDO Next.js procesa el middleware
   ENTONCES Clerk session está disponible (middleware exporta `clerkMiddleware()` con matcher completo)

2. DADO un usuario no autenticado
   CUANDO accede a cualquier ruta bajo `app/(auth)/`
   ENTONCES es redirigido a `/sign-in`

3. DADO un usuario autenticado
   CUANDO accede a una ruta bajo `app/(auth)/`
   ENTONCES ve el contenido (children renderizados)

4. DADO el root layout
   CUANDO se renderiza cualquier página
   ENTONCES el contenido está envuelto en `ClerkProvider` y la metadata de la app es correcta

---

## Alcance

### Incluido
- `middleware.ts` — `clerkMiddleware()` con matcher estándar de Clerk/Next.js
- `app/layout.tsx` — Root layout: `ClerkProvider`, `<html lang="es">`, metadata
- `app/(auth)/layout.tsx` — Redirect a `/sign-in` si no hay userId
- `tests/unit/clerk-foundation.test.ts` — unit tests con mock de Clerk + Next.js

### EXPLÍCITAMENTE EXCLUIDO
- Páginas dentro de `(auth)/` — specs futuras
- Styling/Tabler CSS import — pendiente de confirmar bundle strategy
- Sign-in / sign-up routes — Clerk hosted pages, no requieren código propio
- `app/api/` — specs futuras

---

## Subtareas

| # | Descripción | Criterio de verificación | Estimación |
|---|-------------|--------------------------|------------|
| 1 | Escribir tests (RED) | 4 tests fallan | 0.15h |
| 2 | Implementar 3 archivos | Tests en verde, lint limpio | 0.15h |

---

## Decisiones de Diseño Ya Tomadas

- `clerkMiddleware()` sin callback — protección se delega al layout del grupo `(auth)`
- Redirect en layout (no en middleware) — más fácil de testear y mantener por ruta
- `redirect('/sign-in')` — Clerk hosted sign-in, URL configurada en env `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- Root layout no es async — no necesita `auth()`, solo envuelve con `ClerkProvider`

---

## Archivos Esperados a Modificar

- `middleware.ts` ← nuevo
- `app/layout.tsx` ← nuevo
- `app/(auth)/layout.tsx` ← nuevo
- `tests/unit/clerk-foundation.test.ts` ← nuevo

---

## Dependencias

- [x] SPEC-006: lib/db/client.ts
- [x] SPEC-008: app/actions/projects.ts
