# SPEC-010: app/(auth)/projects/page.tsx — Projects list page

**ID:** SPEC-010
**Fecha:** 2026-11-06
**Autor:** human
**Estado:** APROBADA
**Prioridad:** ALTA
**Clasificación:** SIMPLE

---

## Contexto

### Por qué
Con SPEC-009 las rutas bajo `(auth)/` están protegidas por Clerk. Con SPEC-008 `getProjects()` existe. Falta la primera página visible que conecta ambas capas: la lista de proyectos del usuario autenticado.

### Qué problema resuelve
Estado actual: `app/(auth)/` solo tiene `layout.tsx`. No hay páginas que el usuario pueda ver.
Estado deseado: `/projects` renderiza los proyectos del usuario o un estado vacío accionable.

### Decisiones de BRAIN.md consultadas
- [x] Server Components por defecto — fetching en servidor, no en cliente
- [x] `loading.tsx` y `error.tsx` para segmentos con fetch async (excluido del alcance por ahora)
- [x] Nomenclatura camelCase/PascalCase, named exports preferidos (excepción: page.tsx = default export)

---

## Criterios de Aceptación

1. DADO un usuario autenticado con proyectos
   CUANDO accede a `/projects`
   ENTONCES ve la lista con nombre de cada proyecto

2. DADO un usuario autenticado sin proyectos
   CUANDO accede a `/projects`
   ENTONCES ve un estado vacío con mensaje "Aún no tenés proyectos"

---

## Alcance

### Incluido
- `app/(auth)/projects/page.tsx` — Server Component async, llama `getProjects()`
- `tests/unit/projects-page.test.ts` — unit tests con mock de Server Action

### EXPLÍCITAMENTE EXCLUIDO
- Botón "Crear proyecto" — depende de modal/form con validación (spec futura)
- `loading.tsx` / `error.tsx` — specs futuras
- Paginación — no requerida en fase inicial
- Estilos Tabler detallados — se agrega en iteración posterior

---

## Subtareas

| # | Descripción | Criterio de verificación | Estimación |
|---|-------------|--------------------------|------------|
| 1 | Escribir tests (RED) | 2 tests fallan | 0.10h |
| 2 | Implementar página | Tests en verde, lint limpio | 0.10h |

---

## Decisiones de Diseño Ya Tomadas

- `getProjects()` importado desde `@/app/actions/projects` — Server Action, no llamada directa al repo
- Componente es `async` — Next.js App Router maneja el Suspense automáticamente
- Título `<h1>Proyectos</h1>` visible en ambos estados
- Estado vacío con `<p>` descriptivo, sin botón de acción (scope reducido)
- Lista con `<ul>/<li>` semántico — cada item muestra `name`

---

## Archivos Esperados a Modificar

- `app/(auth)/projects/page.tsx` ← nuevo
- `tests/unit/projects-page.test.ts` ← nuevo

---

## Dependencias

- [x] SPEC-008: app/actions/projects.ts
- [x] SPEC-009: app/(auth)/layout.tsx
