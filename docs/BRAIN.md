# BRAIN.md — Cerebro del Proyecto

**IMPORTANTE:** Solo el revisor humano puede modificar este archivo.
Los agentes lo leen pero nunca lo modifican.

Última actualización: 2026-11-02
Mercado objetivo: Perú (es-PE) 

---

## Stack Tecnológico

| Capa | Tech |
|------|------|
| Framework | Next.js 16.4 (App Router) |
| UI | React 19 + Tabler Icons |
| CSS | Tabler Core (Bootstrap-based) |
| Auth | Clerk |
| ORM | Prisma 6 |
| DB | Neon (PostgreSQL serverless) |
| Email | Resend |
| Testing | Vitest + Playwright |
| Lang | TypeScript 5 |

---

## Decisiones Arquitectónicas

Referencia a ADRs en `docs/decisions/`:
- [001] TBD Policy: Trunk-Based Development, max 24h de vida por rama
- [002] Thermos hooks: revisión pre-push + en builder antes de abrir PR

## Estructura de carpetas (Next.js App Router)

```
app/                  # Rutas y layouts (App Router)
  (auth)/             # Grupo de rutas protegidas por Clerk
  api/                # Route Handlers
components/           # Componentes React reutilizables
  ui/                 # Componentes UI puros (sin lógica de negocio)
lib/                  # Utilidades, helpers, lógica compartida
  db/                 # Cliente Prisma + queries
  email/              # Templates y envío con Resend
prisma/               # Schema y migraciones
public/               # Assets estáticos
tests/
  unit/               # Vitest — lógica pura
  integration/        # Vitest — con DB real (Neon branch de test)
  e2e/                # Playwright — flujos completos
```

---

## Patrones de Código

### General
- Nomenclatura: camelCase para variables/funciones, PascalCase para componentes/tipos/clases
- Async: siempre async/await, nunca callbacks anidados
- Imports: named exports preferidos sobre default exports (excepción: page.tsx y layout.tsx de Next.js que DEBEN ser default export)
- No usar `any` — usar `unknown` + type guards
- No usar `// @ts-ignore` — usar `// @ts-expect-error` con comentario

### Next.js App Router
- Server Components por defecto — añadir `'use client'` solo cuando necesario (eventos, hooks, estado)
- Fetching de datos en Server Components, nunca en Client Components salvo casos justificados
- Route Handlers en `app/api/` para endpoints externos
- `loading.tsx` y `error.tsx` para cada segmento con fetch async
- No usar `getServerSideProps` ni `getStaticProps` — son Pages Router, no App Router

### Clerk (Auth)
- Proteger rutas en `middleware.ts` con `clerkMiddleware()`
- Acceder a usuario en Server Components con `auth()` de `@clerk/nextjs/server`
- Acceder a usuario en Client Components con `useUser()` o `useAuth()`
- NUNCA confiar en el userId del cliente — siempre leerlo del servidor

### Prisma + Neon
- Un solo cliente Prisma exportado desde `lib/db/client.ts` (singleton pattern)
- Nunca instanciar `new PrismaClient()` fuera de `lib/db/client.ts`
- Migraciones solo con `prisma migrate dev` (nunca editar manualmente archivos de migración)
- Neon branches: `main` para producción, `dev` para development, `test` para tests de integración
- Transacciones para operaciones multi-tabla
- **Tests unitarios:** cualquier test que importe código que use `prisma` DEBE mockear `lib/db/client.ts` con `vi.mock('../../lib/db/client', () => ({ prisma: { ... } }))` — el cliente real requiere `DATABASE_URL`

### Resend (Email)
- Templates en `lib/email/templates/` como React Email components
- Envío solo desde Server Actions o Route Handlers, nunca desde Client Components
- Variables de entorno: `RESEND_API_KEY`

### Tabler + CSS
- Usar clases de Tabler Core (Bootstrap-based) — no escribir CSS custom cuando existe clase de Tabler
- Tabler Icons: importar individualmente (`import { IconName } from '@tabler/icons-react'`), nunca importar el paquete completo
- No mezclar Tabler con otras librerías de componentes

---

## Lo que NO hacemos

- No usar Pages Router (`pages/` directory) — todo en App Router
- No usar `getServerSideProps` / `getStaticProps` / `getStaticPaths`
- No client-side fetching con useEffect para datos iniciales de página — usar Server Components
- No instanciar múltiples PrismaClient
- No callbacks anidados — async/await
- No hardcodear strings de conexión o API keys — variables de entorno siempre
- No `any` en TypeScript
- No lógica de negocio en componentes UI (`components/ui/`)
- No consultas SQL raw salvo casos excepcionales documentados en ADR
- No enviar emails desde Client Components

---

## Dependencias Externas

| Servicio | Uso | Criticidad | Variable de entorno |
|----------|-----|------------|---------------------|
| Neon | PostgreSQL serverless (DB principal) | Alta | `DATABASE_URL` |
| Clerk | Autenticación y gestión de usuarios | Alta | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` |
| Resend | Envío de emails transaccionales | Media | `RESEND_API_KEY` |

---

## Estado Actual del Sistema

- Fase: 0 — Fundaciones
- Componentes en producción: ninguno aún
- Deuda técnica conocida: ninguna (proyecto nuevo)
- Áreas frágiles: N/A

## Límite de tamaño: 500 líneas máximo
