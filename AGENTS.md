# AGENTS.md — Reglas del Factory

## Qué pueden hacer los agentes

- Leer cualquier archivo del repositorio
- Crear ramas con prefijo `factory/`
- Crear y modificar archivos en `src/` y `tests/`
- Abrir Pull Requests (nunca hacer merge directamente)
- Ejecutar scripts en `factory/scripts/`
- Leer `docs/BRAIN.md` y `docs/specs/`
- Ejecutar: `npm ci`, `npm run type-check`, `npm run lint`, `npm test`, `npm run build`

## Qué NO pueden hacer

- Push directo a `main`
- Modificar `AGENTS.md`, `CLAUDE.md`, o `docs/BRAIN.md`
- Eliminar tests que están pasando
- Commitear archivos `.env` con valores reales
- Hacer merge de PRs (solo abrir)
- Instalar dependencias nuevas sin que estén especificadas en la spec
- Modificar `package.json`, `tsconfig.json`, `.eslintrc.json` sin aprobación humana explícita

## Prohibido absolutamente

- Hardcodear API keys, tokens, o credenciales en cualquier archivo
- Modificar archivos de configuración de CI/CD sin aprobación humana
- Ejecutar comandos destructivos
- Ignorar o silenciar errores de tests (`jest --passWithNoTests` solo si spec lo indica)
- Usar `// @ts-ignore` o `// eslint-disable` sin comentario explicando por qué

## Comportamiento ante ambigüedad

Si algo no está claro en la spec → marcar con `[REQUIERE_DECISIÓN_HUMANA: descripción]` y detener.
No asumir. No inventar. Preguntar.

## Clasificación COMPLEX (siempre requiere revisión humana)

- Cambios en esquema de base de datos (DDL, migraciones)
- Cambios en interfaces públicas de API (endpoints, contratos de tipos exportados)
- Cambios en autenticación o autorización
- Cambios en configuración de infraestructura (Docker, CI/CD, cloud)
- Cambios en `package.json` (dependencias), `tsconfig.json`, `.eslintrc.json`
- PRs que afectan >3 archivos de lógica de negocio central
- Cualquier cambio en `docs/BRAIN.md`, `AGENTS.md`, `CLAUDE.md`, o archivos de factory
- **Duda sobre clasificación → siempre COMPLEX**

## Clasificación SIMPLE (auto-merge permitido si ambos reviewers PASS)

Todos los siguientes deben ser verdad simultáneamente:
- Ambos reviewers retornan PASS
- Spec original clasificada como SIMPLE
- PR ≤ 200 líneas modificadas
- No modifica archivos de configuración del proyecto
- No introduce dependencias nuevas
- No afecta contratos de tipos exportados

## Regla de oro
En caso de duda → COMPLEX. El costo de revisión humana innecesaria es bajo.
El costo de auto-merge de algo incorrecto puede ser alto.
