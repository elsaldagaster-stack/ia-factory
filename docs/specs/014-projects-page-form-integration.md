# SPEC-014: Integración de CreateProjectForm en /projects + revalidatePath

**ID:** SPEC-014
**Fecha:** 2026-11-07
**Autor:** human
**Estado:** BORRADOR
**Prioridad:** ALTA
**Clasificación:** SIMPLE

---

## Contexto

### Por qué
`CreateProjectForm` (SPEC-011) existe como componente pero no está renderizado en ninguna página. La lista de proyectos (SPEC-010) no tiene forma de crear proyectos desde la UI. Además, `createProject` no llama `revalidatePath` — si el form existiera, la lista no se actualizaría tras el submit.

### Qué problema resuelve
Estado actual: `/projects` muestra lista vacía sin posibilidad de crear proyectos desde la UI; `createProject` no invalida el cache de la ruta.
Estado deseado: `/projects` muestra `CreateProjectForm` encima de la lista; tras crear un proyecto, la lista se actualiza automáticamente sin reload manual.

### Decisiones de BRAIN.md consultadas
- [x] Server Components por defecto — `ProjectsPage` ya es Server Component, el form es Client Component
- [x] Server Actions desde Client Components: válido — `createProject` ya sigue este patrón
- [x] `revalidatePath` en Server Action tras mutación exitosa — patrón estándar Next.js App Router

---

## Criterios de Aceptación

1. DADO un usuario autenticado en `/projects`
   CUANDO la página carga
   ENTONCES ve `CreateProjectForm` (campo + botón) encima de la lista de proyectos

2. DADO el formulario visible con nombre válido
   CUANDO el usuario envía el formulario
   ENTONCES el nuevo proyecto aparece en la lista sin recargar la página manualmente

3. DADO que `createProject` retorna `{ success: true }`
   CUANDO el Server Action completa
   ENTONCES `revalidatePath('/projects')` se ejecuta y la lista se refresca

4. DADO el formulario con nombre vacío
   CUANDO el usuario intenta enviar
   ENTONCES muestra "El nombre es requerido" (comportamiento existente de SPEC-011, sin regresión)

---

## Alcance

### Incluido
- `app/(auth)/projects/page.tsx` — agregar `<CreateProjectForm />` antes de la lista
- `app/actions/projects.ts` — agregar `revalidatePath('/projects')` en `createProject` tras éxito

### EXPLÍCITAMENTE EXCLUIDO
- Redirect a página de detalle del proyecto tras creación — spec futura
- Optimistic UI / loading skeleton de la lista — spec futura
- Ordenamiento o paginación de la lista — spec futura
- Estilos Tabler en la página de proyectos — spec futura de UI

---

## Subtareas

| # | Descripción | Criterio de verificación | Estimación |
|---|-------------|--------------------------|------------|
| 1 | Agregar `revalidatePath('/projects')` en `createProject` tras `return { success: true }` | Test unitario existente sigue verde; nuevo test verifica que `revalidatePath` se llama | 0.15h |
| 2 | Renderizar `<CreateProjectForm />` en `ProjectsPage` | Formulario visible en `/projects`; crear proyecto actualiza la lista | 0.10h |

---

## Decisiones de Diseño Ya Tomadas

- `revalidatePath` va en la Server Action (no en el componente) — es responsabilidad del servidor invalidar su propio cache
- `revalidatePath('/projects')` se llama solo en el path `success: true` — no en error
- `<CreateProjectForm />` se renderiza encima de la lista — orden: form → lista
- No wrappear el form en `<Suspense>` — es Client Component, no tiene fetch propio

---

## Archivos Esperados a Modificar

- `app/actions/projects.ts` ← agregar `revalidatePath`
- `app/(auth)/projects/page.tsx` ← agregar `<CreateProjectForm />`
- `tests/unit/actions-projects.test.ts` ← test que verifica `revalidatePath` llamado en éxito

---

## Dependencias

- [x] SPEC-011: `CreateProjectForm` — completada (PR #14)
- [x] SPEC-010: `ProjectsPage` — completada (PR #13)
- [x] SPEC-008: `createProject` Server Action — completada (PR #11)
