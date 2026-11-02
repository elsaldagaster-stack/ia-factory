# CLAUDE.md — IA Factory

## Stack
Next.js 16.4 (App Router) + React 19 + TypeScript 5 + Prisma 6 + Neon + Clerk + Resend + Vitest + Playwright

## Comandos
- `npm run dev` — servidor de desarrollo Next.js
- `npm run build` — build de producción
- `npm run type-check` — verificar tipos (tsc --noEmit)
- `npm run lint` — ESLint (Next.js lint)
- `npm test` — Vitest (unit + integration)
- `npm run test:coverage` — Vitest con cobertura
- `npm run test:e2e` — Playwright (e2e)
- `npx prisma migrate dev` — aplicar migraciones en development
- `npx prisma studio` — explorar DB visualmente

## Archivos protegidos
Nunca modificar autónomamente:
- `AGENTS.md`
- `CLAUDE.md` (este archivo)
- `docs/BRAIN.md`
- `prisma/schema.prisma` (requiere aprobación humana por clasificación COMPLEX)

## Reglas del factory
Ver `AGENTS.md` para reglas completas.

## Convenciones de código
Ver `docs/BRAIN.md` — secciones "Patrones de Código" y "Lo que NO hacemos".
