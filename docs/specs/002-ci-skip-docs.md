# SPEC-002: CI — skip pasos costosos en PRs doc-only

**ID:** SPEC-002
**Fecha:** 2026-11-04
**Autor:** human
**Estado:** APROBADA
**Prioridad:** ALTA
**Clasificación:** COMPLEX

---

## Contexto

### Por qué
Un PR que solo modifica `docs/BRAIN.md` (una línea) espera 5+ minutos en queue y luego corre `npm ci` + tests completos innecesariamente. El costo en tiempo y runners no tiene valor para cambios puramente documentales.

### Qué problema resuelve
Estado actual: CI corre `npm ci` + type-check + lint + tests para **todo** PR sin importar qué cambió.
Estado deseado: PRs que solo modifican docs/markdown pasan CI en < 30 segundos sin instalar dependencias.

### Decisiones de BRAIN.md consultadas
- [x] No hardcodear lógica fuera de los archivos correctos

---

## Criterios de Aceptación

1. DADO un PR que solo modifica archivos `.md` o rutas `docs/**` o `factory/agents/**`
   CUANDO CI / validate corre
   ENTONCES el job completa en < 30 segundos sin ejecutar `npm ci`, type-check, lint, ni tests

2. DADO un PR que modifica al menos un archivo de código (`.ts`, `.tsx`, `package.json`, `.yml`, etc.)
   CUANDO CI / validate corre
   ENTONCES todos los pasos de validación corren normalmente (sin cambio de comportamiento)

3. DADO un push directo a `main` (merge commit)
   CUANDO CI / validate corre
   ENTONCES todos los pasos de validación corren normalmente

4. DADO un PR doc-only
   CUANDO CI / validate completa
   ENTONCES el check aparece como ✅ passed y el merge queda habilitado

---

## Alcance

### Incluido
- Detección de cambios doc-only en `.github/workflows/ci.yml`
- Pasos costosos condicionados: Setup Node.js, Install dependencies, Type check, Lint, Tests, PR size check, Security audit

### EXPLÍCITAMENTE EXCLUIDO
- Cambios en `pr-check.yml` — ese workflow es rápido (< 10s), no vale la pena
- Cambios en `factory-review.yml`
- Lógica de detección fuera de `ci.yml`

---

## Subtareas

| # | Descripción | Criterio de verificación | Estimación |
|---|-------------|--------------------------|------------|
| 1 | Agregar step `detect-changes` que setea `code_changed` en `GITHUB_OUTPUT` | Step existe, output seteado correctamente en ambas ramas (PR vs push) | 0.25h |
| 2 | Agregar `if: steps.paths.outputs.code_changed == 'true'` a todos los pasos costosos | CI pasa para PR con solo cambios de .md | 0.25h |

---

## Decisiones de Diseño Ya Tomadas

- Usar `GITHUB_OUTPUT` (no `set-output` deprecado)
- Detección vía `git diff --name-only` — no actions externas (dorny/paths-filter, etc.)
- Pushes a main siempre corren CI completo — solo PRs tienen la optimización
- Doc-only = solo archivos que matcheen: `*.md`, `docs/**`, `factory/agents/**`
- El checkout (`actions/checkout`) siempre corre — necesario para git diff
- NO usar `paths-ignore` en el trigger — causa que el check no aparezca como passed, bloqueando el merge

---

## Archivos Esperados a Modificar

- `.github/workflows/ci.yml` ← único archivo

---

## Dependencias

- Ninguna. No depende de otras specs.

---

## Notas para el Agente

COMPLEX por modificar CI config — requiere revisión humana antes de merge.
El check de branch protection se llama exactamente `CI / validate` — no cambiar el nombre del job.
