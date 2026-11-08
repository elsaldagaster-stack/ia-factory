# SPEC-015: app/(auth)/projects/[id]/page.tsx — Página de detalle de proyecto

**ID:** SPEC-015
**Fecha:** 2026-11-07
**Autor:** human
**Estado:** BORRADOR
**Prioridad:** ALTA
**Clasificación:** SIMPLE

---

## Contexto

### Por qué
Los proyectos en la lista (`/projects`) no son navegables. Sin una página de detalle no hay punto de entrada para las features que viven dentro de un proyecto (tareas, agentes, pipelines). Es el prerequisito estructural de toda la funcionalidad futura de IA Factory.

### Qué problema resuelve
Estado actual: lista de proyectos muestra nombres como texto plano sin link; `getProject(id)` existe pero nada lo consume en UI.
Estado deseado: cada proyecto en la lista es un link a `/projects/[id]` que muestra nombre, descripción y estado del proyecto; si el proyecto no existe o no pertenece al usuario → 404.

### Decisiones de BRAIN.md consultadas
- [x] Server Components por defecto — página de detalle es solo lectura, no necesita `'use client'`
- [x] `notFound()` de `next/navigation` para 404 — patrón estándar App Router
- [x] `getProject` ya existe en `app/actions/projects.ts` y aplica aislamiento por `ownerId`

---

## Criterios de Aceptación

1. DADO un usuario autenticado en `/projects`
   CUANDO la página lista proyectos
   ENTONCES cada proyecto es un link `<a href="/projects/[id]">` con el nombre del proyecto

2. DADO un usuario autenticado con un proyecto existente
   CUANDO navega a `/projects/[id]` con su propio proyecto
   ENTONCES ve el nombre del proyecto como título y su estado (`status`)

3. DADO un usuario autenticado
   CUANDO navega a `/projects/[id]` con un ID que no existe o no le pertenece
   ENTONCES recibe una página 404 (via `notFound()`)

4. DADO la página de detalle
   CUANDO renderiza
   ENTONCES hay un link de regreso a `/projects`

---

## Alcance

### Incluido
- `app/(auth)/projects/[id]/page.tsx` — Server Component que llama `getProject(id)` y renderiza detalle
- `app/(auth)/projects/page.tsx` — convertir `<li>{project.name}</li>` en `<li><Link href="/projects/[id]">{project.name}</Link></li>`
- Tests unitarios para ambos componentes actualizados

### EXPLÍCITAMENTE EXCLUIDO
- Editar proyecto desde la página de detalle — spec futura
- Eliminar proyecto — spec futura
- Tareas/agentes dentro del proyecto — spec futura
- Estilos Tabler detallados — spec futura de UI
- Breadcrumbs — spec futura de navegación

---

## Subtareas

| # | Descripción | Criterio de verificación | Estimación |
|---|-------------|--------------------------|------------|
| 1 | Escribir tests (RED) — detalle renderiza nombre y status; 404 cuando no existe; lista tiene links | Tests fallan | 0.15h |
| 2 | Implementar `app/(auth)/projects/[id]/page.tsx` con `notFound()` | Tests del detalle verdes | 0.15h |
| 3 | Actualizar `ProjectsPage` para usar `<Link>` en cada proyecto | Test de lista verde | 0.10h |

---

## Decisiones de Diseño Ya Tomadas

- `params` tipado como `Promise<{ id: string }>` — Next.js 15+ hace params async
- `getProject(id)` ya aplica aislamiento por `ownerId` — no necesita validación extra en la página
- `notFound()` (no redirect) cuando proyecto no encontrado — correcto semánticamente
- `<Link>` de `next/link` para navegación client-side entre páginas del grupo `(auth)`
- `description` es opcional en Prisma schema — mostrar solo si no es `null`

---

## Archivos Esperados a Modificar

- `app/(auth)/projects/[id]/page.tsx` ← nuevo
- `app/(auth)/projects/page.tsx` ← agregar `<Link>`
- `tests/unit/project-detail-page.test.ts` ← nuevo
- `tests/unit/projects-page.test.ts` ← actualizar para verificar links

---

## Dependencias

- [x] SPEC-008: `getProject` Server Action — completada
- [x] SPEC-010: `ProjectsPage` — completada
- [x] SPEC-014: form integration mergeada — completada
