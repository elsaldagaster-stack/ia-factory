# SPEC-006: lib/db/client.ts — Prisma Client singleton

**ID:** SPEC-006
**Fecha:** 2026-11-04
**Autor:** human
**Estado:** APROBADA
**Prioridad:** ALTA
**Clasificación:** SIMPLE

---

## Contexto

### Por qué
Next.js hot reload en desarrollo crea múltiples módulos, lo que instancia múltiples `PrismaClient` y agota el connection pool. Sin el patrón singleton con `globalThis`, cada hot reload abre nuevas conexiones a Neon que nunca se liberan.

### Qué problema resuelve
Estado actual: no existe ningún cliente Prisma exportado. Cualquier Server Action que necesite DB tendría que hacer `new PrismaClient()` directamente, violando la regla de BRAIN.md.
Estado deseado: `import { prisma } from '@/lib/db/client'` usable desde cualquier Server Action o Route Handler.

### Decisiones de BRAIN.md consultadas
- [x] Un solo cliente Prisma exportado desde `lib/db/client.ts` (singleton pattern)
- [x] Nunca instanciar `new PrismaClient()` fuera de `lib/db/client.ts`

---

## Criterios de Aceptación

1. DADO el archivo `lib/db/client.ts`
   CUANDO se importa `prisma` desde `@/lib/db/client`
   ENTONCES es una instancia de `PrismaClient`

2. DADO entorno de desarrollo (`NODE_ENV !== 'production'`)
   CUANDO el módulo se carga múltiples veces (hot reload)
   ENTONCES retorna siempre la misma instancia (via `globalThis`)

3. DADO entorno de producción (`NODE_ENV === 'production'`)
   CUANDO el módulo se carga
   ENTONCES NO asigna el cliente a `globalThis` (workers son efímeros, no hay hot reload)

4. DADO el archivo compilado
   CUANDO se ejecuta `npx tsc --noEmit`
   ENTONCES pasa sin errores de tipos

---

## Alcance

### Incluido
- `lib/db/client.ts` — singleton `PrismaClient` con patrón `globalThis`

### EXPLÍCITAMENTE EXCLUIDO
- Configuración de logging de Prisma (spec futura)
- Extension de PrismaClient con middlewares
- Tests de integración con DB real (requieren `DATABASE_URL` real)
- `DATABASE_URL` ya documentada en `.env.example` (hecho en SPEC-004)

---

## Subtareas

| # | Descripción | Criterio de verificación | Estimación |
|---|-------------|--------------------------|------------|
| 1 | Crear `lib/db/client.ts` con singleton pattern | `tsc --noEmit` pasa | 0.10h |
| 2 | Verificar que `prisma` es instancia de `PrismaClient` via type check | Sin errores de tipo | 0.05h |

---

## Decisiones de Diseño Ya Tomadas

- `globalThis as unknown as { prisma: PrismaClient }` — cast necesario porque `globalThis` no tiene `prisma` en su tipo. `unknown` evita `any`.
- Solo asignar a `globalThis` en no-producción — en producción cada worker es una instancia fresca, el singleton global es innecesario y podría causar problemas con serverless lifecycle.
- Exportar `prisma` como named export (no default) — consistente con el resto de `lib/`

---

## Archivos Esperados a Modificar

- `lib/db/client.ts` ← nuevo

---

## Dependencias

- [x] Depende de SPEC-004: prisma/schema.prisma (schema existe, `prisma generate` ya corrido)
