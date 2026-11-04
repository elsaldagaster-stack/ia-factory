# SPEC-007: lib/db/projects.ts — Repositorio de proyectos

**ID:** SPEC-007
**Fecha:** 2026-11-04
**Autor:** human
**Estado:** APROBADA
**Prioridad:** ALTA
**Clasificación:** SIMPLE

---

## Contexto

### Por qué
Los Server Actions del dashboard necesitan leer y escribir proyectos. Sin una capa de repositorio, cada Server Action escribiría queries Prisma directamente, duplicando filtros, ordenamiento y manejo de errores.

### Qué problema resuelve
Estado actual: `lib/db/client.ts` existe pero no hay ninguna función que acceda al modelo `Project`.
Estado deseado: funciones tipadas en `lib/db/projects.ts` para las operaciones CRUD básicas de proyectos, usables desde Server Actions.

### Decisiones de BRAIN.md consultadas
- [x] Prisma: queries solo desde `lib/db/` — nunca en Server Actions directamente
- [x] `ownerId` = Clerk user ID (string), nunca confiar en userId del cliente
- [x] Sin tabla User — `ownerId` es el filtro principal
- [x] Index `@@index([ownerId, createdAt(sort: Desc)])` cubre la query principal

---

## Criterios de Aceptación

1. DADO un `ownerId` válido
   CUANDO se llama `getProjectsByOwner(ownerId)`
   ENTONCES retorna array de proyectos ordenados por `createdAt DESC` del owner

2. DADO datos válidos `{ name, ownerId, description? }`
   CUANDO se llama `createProject(data)`
   ENTONCES crea el proyecto en DB y retorna el proyecto creado

3. DADO un `id` y `ownerId`
   CUANDO se llama `getProjectById(id, ownerId)`
   ENTONCES retorna el proyecto solo si pertenece al owner, o `null` si no existe / no pertenece

4. DADO un `id`, `ownerId` y campos a actualizar
   CUANDO se llama `updateProject(id, ownerId, data)`
   ENTONCES actualiza solo si el proyecto pertenece al owner y retorna el proyecto actualizado

5. DADO un `id` y `ownerId` inexistente o sin permisos
   CUANDO se llama `updateProject(id, ownerId, data)` o `getProjectById(id, ownerId)`
   ENTONCES retorna `null` sin lanzar excepción

---

## Alcance

### Incluido
- `lib/db/projects.ts` — `getProjectsByOwner`, `createProject`, `getProjectById`, `updateProject`
- `tests/unit/db-projects.test.ts` — unit tests con `vi.mock('../../lib/db/client')`

### EXPLÍCITAMENTE EXCLUIDO
- `deleteProject` — soft delete via `status: ARCHIVED` es suficiente por ahora
- Paginación — suficiente con array completo para Fase 1
- Búsqueda / filtro por nombre — spec futura
- Tests de integración con DB real

---

## Subtareas

| # | Descripción | Criterio de verificación | Estimación |
|---|-------------|--------------------------|------------|
| 1 | Escribir tests con mock de prisma | Tests en rojo | 0.20h |
| 2 | Implementar las 4 funciones | Tests en verde | 0.20h |

---

## Decisiones de Diseño Ya Tomadas

- `ownerId` siempre incluido en WHERE — nunca exponer proyectos de otro usuario
- `getProjectsByOwner` incluye proyectos en todos los estados (ACTIVE, COMPLETED, ARCHIVED) — el filtro de UI es responsabilidad del caller
- `updateProject` usa `ownerId` en WHERE, no en findFirst + update separados — evita TOCTOU race condition
- Tipos: usar `Prisma.ProjectCreateInput` / `Prisma.ProjectUpdateInput` donde sea posible para no duplicar tipos del schema
- Funciones nunca lanzan — errores de Prisma se propagan (el caller, que es un Server Action, los maneja)

---

## Archivos Esperados a Modificar

- `lib/db/projects.ts` ← nuevo
- `tests/unit/db-projects.test.ts` ← nuevo

---

## Dependencias

- [x] SPEC-004: prisma/schema.prisma (modelo Project existe)
- [x] SPEC-006: lib/db/client.ts (cliente Prisma exportado)
