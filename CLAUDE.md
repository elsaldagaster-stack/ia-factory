# CLAUDE.md — IA Factory

## Stack
TypeScript + Node.js

## Comandos
- `npm ci` — instalar dependencias
- `npm run type-check` — verificar tipos (tsc --noEmit)
- `npm run lint` — ESLint
- `npm test` — Jest
- `npm run test:coverage` — Jest con cobertura
- `npm run build` — compilar a dist/

## Archivos protegidos
Nunca modificar autónomamente:
- `AGENTS.md`
- `CLAUDE.md` (este archivo)
- `docs/BRAIN.md`

## Reglas del factory
Ver `AGENTS.md` para reglas completas de qué pueden y no pueden hacer los agentes.

## Convenciones de código
Ver `docs/BRAIN.md` sección "Patrones de Código".
