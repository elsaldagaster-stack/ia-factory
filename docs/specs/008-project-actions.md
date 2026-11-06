# SPEC-008: app/actions/projects.ts — Server Actions de proyectos

**ID:** SPEC-008
**Fecha:** 2026-11-05
**Autor:** human
**Estado:** APROBADA
**Prioridad:** ALTA
**Clasificación:** SIMPLE

---

## Contexto

### Por qué
Los Server Components y Client Components necesitan crear y leer proyectos. Sin Server Actions, los componentes llamarían directamente al repositorio (imposible desde Client Components) o crearían sus propias Route Handlers (duplicación). Los Server Actions son la capa entre UI y repositorio en App Router.

### Qué problema resuelve
Estado actual: `lib/db/projects.ts` existe pero no hay ningún punto de entrada para la UI.
Estado deseado: Server Actions tipadas en `app/actions/projects.ts` que obtienen `ownerId` de Clerk server-side y delegan al repositorio.

### Decisiones de BRAIN.md consultadas
- [x] `auth()` de `@clerk/nextjs/server` para obtener userId en Server Actions
- [x] NUNCA confiar en userId del cliente — siempre leerlo del servidor
- [x] Queries solo desde `lib/db/` — Server Actions solo orquestan, no tocan prisma directo

---

## Criterios de Aceptación

1. DADO un usuario autenticado
   CUANDO se llama `getProjects()`
   ENTONCES retorna los proyectos del usuario actual (ownerId de Clerk)

2. DADO un usuario autenticado y datos válidos `{ name, description? }`
   CUANDO se llama `createProject(data)`
   ENTONCES crea el proyecto con `ownerId` del usuario autenticado y retorna `{ success: true, project }`

3. DADO un usuario no autenticado
   CUANDO se llama cualquier Server Action
   ENTONCES lanza error (redirige o retorna `{ success: false, error: 'Unauthorized' }`)

4. DADO un error de DB en `createProject`
   CUANDO Prisma lanza una excepción
   ENTONCES retorna `{ success: false, error: mensaje }` sin propagar

5. DADO un `projectId` válido del usuario
   CUANDO se llama `getProject(projectId)`
   ENTONCES retorna el proyecto o `null` si no pertenece al usuario

---

## Alcance

### Incluido
- `app/actions/projects.ts` — `getProjects`, `getProject`, `createProject`
- `tests/unit/actions-projects.test.ts` — unit tests con mock de Clerk + repositorio

### EXPLÍCITAMENTE EXCLUIDO
- `updateProjectAction` — necesita validación de formulario (spec futura con zod)
- Revalidación de path (`revalidatePath`) — depende de rutas que no existen aún
- Server Actions para specs/pipeline runs — specs futuras

---

## Subtareas

| # | Descripción | Criterio de verificación | Estimación |
|---|-------------|--------------------------|------------|
| 1 | Escribir tests con mock de `@clerk/nextjs/server` y `lib/db/projects` | Tests en rojo | 0.20h |
| 2 | Implementar las 3 Server Actions | Tests en verde, lint limpio | 0.20h |

---

## Decisiones de Diseño Ya Tomadas

- `'use server'` al tope del archivo — todas las funciones del módulo son Server Actions
- `auth()` lanzada al inicio de cada action — si no hay sesión, Clerk lanza error (no retornamos `null` silencioso)
- `createProject` retorna `ActionResult<Project>` — discriminated union para que el Client Component pueda manejar errores sin try/catch
- `getProjects` y `getProject` pueden lanzar (son usadas desde Server Components que pueden hacer error boundaries)
- `ownerId` NUNCA viene del payload del cliente — siempre de `auth().userId`

---

## Archivos Esperados a Modificar

- `app/actions/projects.ts` ← nuevo
- `tests/unit/actions-projects.test.ts` ← nuevo

---

## Dependencias

- [x] SPEC-006: lib/db/client.ts
- [x] SPEC-007: lib/db/projects.ts
