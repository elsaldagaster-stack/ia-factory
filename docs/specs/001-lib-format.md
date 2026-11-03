# SPEC-001: lib/format — Utilidades de formato

**ID:** SPEC-001
**Fecha:** 2026-11-03
**Autor:** human
**Estado:** APROBADA
**Prioridad:** MEDIA
**Clasificación:** SIMPLE

---

## Contexto

### Por qué
El proyecto necesitará mostrar fechas y strings en la UI de forma consistente. Sin un lugar centralizado, cada componente formatea a su manera, generando inconsistencias visuales y lógica duplicada.

### Qué problema resuelve
Estado actual: no existe ninguna función de formato en `lib/`.
Estado deseado: módulo `lib/format.ts` con funciones tipadas para formatear fechas y truncar strings, usable desde cualquier Server o Client Component.

### Decisiones de BRAIN.md consultadas
- [x] Nomenclatura: camelCase para funciones, named exports
- [x] No usar `any` — tipos explícitos
- [x] No dependencias nuevas — usar `Intl` nativo de JavaScript

---

## Criterios de Aceptación

1. DADO una instancia de `Date` válida
   CUANDO se llama `formatDate(date)`
   ENTONCES retorna string en formato `dd/mm/yyyy` (ej: `"03/11/2026"`)

2. DADO una instancia de `Date` válida
   CUANDO se llama `formatDateTime(date)`
   ENTONCES retorna string en formato `dd/mm/yyyy HH:mm` (ej: `"03/11/2026 14:30"`)

3. DADO un string más largo que `maxLength`
   CUANDO se llama `truncate(str, maxLength)`
   ENTONCES retorna el string cortado en `maxLength - 3` caracteres + `"..."`

4. DADO un string con longitud ≤ `maxLength`
   CUANDO se llama `truncate(str, maxLength)`
   ENTONCES retorna el string sin modificaciones

5. DADO `formatDate` o `formatDateTime`
   CUANDO se llaman sin argumentos de locale explícito
   ENTONCES usan locale `es-AR` como default

---

## Alcance

### Incluido
- `formatDate(date: Date): string` — fecha sin hora
- `formatDateTime(date: Date): string` — fecha con hora
- `truncate(str: string, maxLength: number): string` — cortar con ellipsis

### EXPLÍCITAMENTE EXCLUIDO
- Formateo de moneda o números
- Relative time (ej: "hace 2 horas") — se agrega en spec futura si se necesita
- Parsing de strings a Date
- Soporte multi-locale configurable — solo `es-AR` por ahora

---

## Subtareas

| # | Descripción | Criterio de verificación | Estimación |
|---|-------------|--------------------------|------------|
| 1 | Escribir tests para las 3 funciones | `vitest run` muestra 5 tests en rojo (RED) | 0.25h |
| 2 | Implementar `formatDate` y `formatDateTime` con `Intl.DateTimeFormat` | Tests de fecha pasan | 0.25h |
| 3 | Implementar `truncate` | Tests de truncate pasan | 0.25h |

---

## Decisiones de Diseño Ya Tomadas

- Usar `Intl.DateTimeFormat` nativo — no agregar `date-fns` ni similares
- Locale default `es-AR` — acorde con el mercado objetivo (LATAM)
- `formatDate` retorna `dd/mm/yyyy` — no ISO, no US format
- `truncate` usa `"..."` (tres puntos) no ellipsis unicode `"…"` — mayor compatibilidad

---

## Archivos Esperados a Modificar

- `lib/format.ts` ← nuevo
- `tests/unit/format.test.ts` ← nuevo

---

## Dependencias

- Ninguna. Esta spec no depende de otras specs.

---

## Notas para el Agente

Los tests van en `tests/unit/` (environment: jsdom en vitest.config.ts). Las funciones son puras — no necesitan mock. Seguir patrón de `src/validator.ts` para estructura del módulo.
