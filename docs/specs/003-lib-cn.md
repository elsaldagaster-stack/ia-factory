# SPEC-003: lib/cn — Merge de clases CSS

**ID:** SPEC-003
**Fecha:** 2026-11-04
**Autor:** human
**Estado:** APROBADA
**Prioridad:** MEDIA
**Clasificación:** SIMPLE

---

## Contexto

### Por qué
Los componentes de UI con Tabler necesitan combinar clases CSS condicionalmente (ej: clase base + clase de estado + clase de variante). Sin una utilidad centralizada, cada componente hace su propia concatenación con lógica dispersa y difícil de leer.

### Qué problema resuelve
Estado actual: no existe forma estándar de combinar clases en el proyecto.
Estado deseado: función `cn(...classes)` en `lib/cn.ts` que filtra valores falsy y une con espacio. Usable desde cualquier componente.

### Decisiones de BRAIN.md consultadas
- [x] Nomenclatura: camelCase para funciones, named exports
- [x] No usar `any` — tipos explícitos con union types
- [x] No dependencias nuevas — no instalar `clsx` ni `tailwind-merge`
- [x] No lógica de negocio en `components/ui/` — la utilidad va en `lib/`

---

## Criterios de Aceptación

1. DADO strings de clases válidas
   CUANDO se llama `cn('btn', 'btn-primary')`
   ENTONCES retorna `'btn btn-primary'`

2. DADO valores falsy mezclados con strings
   CUANDO se llama `cn('btn', null, undefined, false, 'active')`
   ENTONCES retorna `'btn active'` (sin espacios extra ni strings vacíos)

3. DADO un solo argumento
   CUANDO se llama `cn('btn')`
   ENTONCES retorna `'btn'`

4. DADO ningún argumento válido (todos falsy)
   CUANDO se llama `cn(null, undefined, false)`
   ENTONCES retorna `''` (string vacío, no lanza error)

5. DADO strings con espacios internos
   CUANDO se llama `cn('btn btn-lg', 'text-white')`
   ENTONCES retorna `'btn btn-lg text-white'` (preserva espacios internos)

---

## Alcance

### Incluido
- `cn(...classes: ClassValue[]): string` donde `ClassValue = string | undefined | null | false`

### EXPLÍCITAMENTE EXCLUIDO
- Soporte de objetos `{ 'clase': boolean }` — se agrega si se necesita
- Soporte de arrays anidados
- Deduplicación de clases repetidas
- Integración con Tailwind merge

---

## Subtareas

| # | Descripción | Criterio de verificación | Estimación |
|---|-------------|--------------------------|------------|
| 1 | Escribir tests para los 5 criterios | `vitest run` muestra 5+ tests en rojo | 0.25h |
| 2 | Implementar `cn` con `filter` + `join` | Todos los tests pasan | 0.15h |

---

## Decisiones de Diseño Ya Tomadas

- Tipo `ClassValue = string | undefined | null | false` — no boolean genérico (evita `true` que sería inválido)
- Implementación: `filter(Boolean).join(' ')` — sin dependencias, legible
- Nombre `cn` — convención estándar en ecosistema React, reconocible

---

## Archivos Esperados a Modificar

- `lib/cn.ts` ← nuevo
- `tests/unit/cn.test.ts` ← nuevo

---

## Dependencias

- Ninguna.
