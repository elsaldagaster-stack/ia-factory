# SPEC-011: components/CreateProjectForm.tsx — Formulario de creación de proyectos

**ID:** SPEC-011
**Fecha:** 2026-11-06
**Autor:** human
**Estado:** APROBADA
**Prioridad:** ALTA
**Clasificación:** SIMPLE

---

## Contexto

### Por qué
La página `/projects` (SPEC-010) muestra la lista de proyectos pero no tiene forma de crear nuevos. Sin un formulario, los usuarios autenticados no pueden iniciar ningún flujo productivo. Este es el primer punto de entrada de escritura de la aplicación.

### Qué problema resuelve
Estado actual: `createProject()` Server Action existe pero ningún componente UI lo invoca.
Estado deseado: `CreateProjectForm` — Client Component que llama `createProject()` y muestra estados de éxito/error sin recargar la página.

### Decisiones de BRAIN.md consultadas
- [x] `'use client'` solo cuando necesario — este componente maneja estado de formulario, requiere `'use client'`
- [x] Server Actions desde Client Components: válido
- [x] No `any` en TypeScript
- [x] Tabler CSS para estilos — usar clases Bootstrap/Tabler existentes

---

## Criterios de Aceptación

1. DADO un usuario autenticado en `/projects`
   CUANDO el formulario se renderiza
   ENTONCES muestra un campo `name` y un botón de submit

2. DADO el formulario visible con campo `name` vacío
   CUANDO el usuario intenta enviar el formulario
   ENTONCES muestra el mensaje "El nombre es requerido" sin llamar a `createProject`

3. DADO el campo `name` con texto válido (1–100 caracteres)
   CUANDO el usuario envía el formulario
   ENTONCES llama a `createProject({ name })` con el valor del campo

4. DADO que `createProject` retorna `{ success: true, project }`
   CUANDO el submit completa
   ENTONCES muestra el mensaje "Proyecto creado exitosamente" y limpia el campo

5. DADO que `createProject` retorna `{ success: false, error: mensaje }`
   CUANDO el submit completa
   ENTONCES muestra el mensaje de error retornado por la acción

---

## Alcance

### Incluido
- `components/CreateProjectForm.tsx` — Client Component con `useActionState` (React 19)
- `tests/unit/create-project-form.test.ts` — unit tests con mock de Server Action

### EXPLÍCITAMENTE EXCLUIDO
- Campo `description` — opcional, spec futura
- Zod validation — requeriría nueva dependencia, spec futura
- Modal/dialog wrapper — el componente se renderiza inline; el caller decide dónde
- Redirect tras éxito / `revalidatePath` — depende de integración con router, spec futura
- Estilos Tabler detallados — se agrega en iteración de UI posterior

---

## Subtareas

| # | Descripción | Criterio de verificación | Estimación |
|---|-------------|--------------------------|------------|
| 1 | Escribir tests (RED) — 5 tests cubriendo render, validación client-side, submit válido, success, error | 5 tests fallan | 0.20h |
| 2 | Implementar `CreateProjectForm` con `useActionState` | 5 tests verdes, lint limpio | 0.20h |

---

## Decisiones de Diseño Ya Tomadas

- `useActionState(wrappedAction, null)` — `wrappedAction` adapta `(prevState, FormData) => ActionResult` al signature de `createProject`
- Validación client-side en `wrappedAction`: si `name.trim()` está vacío → retornar `{ success: false, error: 'El nombre es requerido' }` sin llamar al server
- `isPending` de `useActionState` para deshabilitar submit durante envío
- Estado inicial `null` — componente renderiza sin mensaje hasta primer intento
- Limpiar campo `name` tras éxito usando `key` prop o ref.reset() en el form
- No `revalidatePath` en este componente — responsabilidad futura del caller o de la integración

---

## Archivos Esperados a Modificar

- `components/CreateProjectForm.tsx` ← nuevo
- `tests/unit/create-project-form.test.ts` ← nuevo

---

## Dependencias

- [x] SPEC-008: `createProject` Server Action en `app/actions/projects.ts`
- [ ] Esta spec debe completarse antes de integrar el form en SPEC-010 (page update)
