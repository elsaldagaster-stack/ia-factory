# SPEC-004: Prisma schema inicial — modelo Project

**ID:** SPEC-004
**Fecha:** 2026-11-04
**Autor:** human
**Estado:** APROBADA
**Prioridad:** ALTA
**Clasificación:** COMPLEX

---

## Contexto

### Por qué
La app es multi-usuario. Sin un schema de DB no hay persistencia de ningún tipo. `Project` es la entidad central del factory — todo lo demás (specs, pipeline runs) se anclará a un proyecto.

### Qué problema resuelve
Estado actual: no existe `prisma/schema.prisma` ni ningún modelo de datos.
Estado deseado: schema válido con datasource Neon + modelo `Project` con índice por `ownerId`.

### Decisiones de BRAIN.md consultadas
- [x] ORM: Prisma 6
- [x] DB: Neon (PostgreSQL serverless)
- [x] Auth: Clerk — sin tabla `User`, `ownerId` es el Clerk user ID (string)
- [x] Migraciones solo con `prisma migrate dev` (nunca editar archivos de migración manualmente)

---

## Criterios de Aceptación

1. DADO el archivo `prisma/schema.prisma`
   CUANDO se ejecuta `DATABASE_URL="postgresql://dummy:dummy@localhost/dummy" npx prisma validate`
   ENTONCES termina con exit code 0 sin errores (nota: `prisma validate` requiere DATABASE_URL aunque sea dummy)

2. DADO el schema
   CUANDO se ejecuta `DATABASE_URL="postgresql://dummy:dummy@localhost/dummy" npx prisma format --check`
   ENTONCES el archivo no tiene cambios de formato (ya está formateado correctamente)

3. DADO el modelo `Project`
   CUANDO se revisa el schema
   ENTONCES tiene los campos: `id` (cuid), `name`, `description` (opcional), `status` (enum con default ACTIVE), `ownerId`, `createdAt`, `updatedAt`

4. DADO múltiples usuarios
   CUANDO un usuario consulta sus proyectos por `ownerId`
   ENTONCES el índice `@@index([ownerId])` está presente para soportar esa query eficientemente

5. DADO el datasource
   CUANDO se revisa el schema
   ENTONCES apunta a `provider = "postgresql"` con `url = env("DATABASE_URL")`

---

## Alcance

### Incluido
- `prisma/schema.prisma` con datasource + generator + modelo `Project` + enum `ProjectStatus`
- `DATABASE_URL` documentado en `.env.example`

### EXPLÍCITAMENTE EXCLUIDO
- Modelos `Spec`, `PipelineRun`, `Team` — specs futuras
- Tabla `User` — Clerk es la fuente de verdad, no sincronizamos usuarios
- Migraciones — se corren manualmente con `prisma migrate dev` (fuera del scope de esta spec, requiere DB real)
- `lib/db/client.ts` — Prisma client singleton (SPEC-005)
- Seeds de datos

---

## Subtareas

| # | Descripción | Criterio de verificación | Estimación |
|---|-------------|--------------------------|------------|
| 1 | Crear `prisma/schema.prisma` con datasource y generator | Archivo existe, sintaxis correcta | 0.15h |
| 2 | Agregar modelo `Project` y enum `ProjectStatus` | `npx prisma validate` pasa | 0.15h |
| 3 | Documentar `DATABASE_URL` en `.env.example` | Variable presente con comentario | 0.10h |

---

## Decisiones de Diseño Ya Tomadas

- `id`: `String @id @default(cuid())` — CUID es URL-safe, globalmente único, no secuencial (evita enumeración)
- `ownerId`: `String` — Clerk user ID, no FK a tabla User (Clerk es la fuente)
- `@@index([ownerId])` — query principal será "todos los proyectos de este usuario"
- `description`: opcional (`String?`) — nombre obligatorio, descripción puede agregarse después
- `status`: enum `ProjectStatus` con valores `ACTIVE`, `ARCHIVED`, `COMPLETED`
- No `@@unique([ownerId, name])` todavía — puede agregarse si se decide que un usuario no puede tener dos proyectos con el mismo nombre (decisión de producto pendiente)
- Neon usa `postgresql` como provider (no `cockroachdb`)

---

## Archivos Esperados a Modificar

- `prisma/schema.prisma` ← nuevo
- `.env.example` ← agregar `DATABASE_URL`

---

## Dependencias

- Ninguna. Este schema es la base de SPEC-005 (`lib/db/client.ts`).

---

## Notas para el Agente

COMPLEX por ser cambio de schema de DB. No correr `prisma migrate dev` — eso requiere `DATABASE_URL` real y se hace manualmente. Solo crear el archivo y validar con `prisma validate`.
