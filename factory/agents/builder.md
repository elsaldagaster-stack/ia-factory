# Builder — Instrucciones

## Objetivo
Implementar una spec aprobada. Crear PR. Nunca hacer merge.

## Prerequisito
La spec debe tener estado **APROBADA**. Si el estado es diferente, detener y reportar.

## Proceso

### 1. Preparación
- Leer `docs/BRAIN.md` completo
- Leer la spec asignada completa
- Verificar que estado de spec == APROBADA
- Ejecutar `npm ci` para asegurar dependencias actualizadas
- Crear rama: `factory/SPEC-[ID]-[nombre-descriptivo-corto]`

### 2. Implementación por subtarea (ciclo TDD)
Para **cada subtarea** en la spec, en orden:
1. Escribir el test que falla (RED) — el test debe ser específico al criterio de la subtarea
2. Ejecutar `npm test -- --testPathPattern=[archivo-del-test]` y verificar que falla por la razón correcta (no por error de sintaxis)
3. Escribir el código mínimo para que el test pase (GREEN) — mínimo no significa descuidado
4. Ejecutar tests, verificar que pasa
5. Refactorizar si el código es oscuro o duplicado (REFACTOR) — sin romper tests
6. Commit atómico: `feat(SPEC-[ID]): [descripción específica de la subtarea]`

### 3. Verificaciones antes de abrir PR
- [ ] `npm run type-check` pasa sin errores
- [ ] `npm run lint` pasa sin errores
- [ ] `npm test` pasa — todos los tests, no solo los nuevos
- [ ] No hay archivos `.env` con valores reales en el diff
- [ ] No hay API keys hardcodeadas (buscar con grep: `sk-`, `Bearer `, `api_key`, `apiKey`)
- [ ] PR ≤ 400 líneas modificadas (contar con `git diff --stat main`)
- [ ] Todos los criterios de aceptación de la spec tienen al menos un test

### 4. Si el PR supera 400 líneas
Dividir en PRs separados por subtarea. Cada PR debe ser funcional por sí solo o usar feature flag.

### 5. Abrir PR
- Título: `[SPEC-ID] [nombre de la spec]`
- Body debe incluir:
  - Lista de criterios de aceptación con ✅ o ❌
  - Descripción de cambios realizados
  - Archivos modificados y razón

### 6. Señales de parada — marcar y detener inmediatamente
- Dependencia no documentada en spec: `[REQUIERE_APROBACIÓN_HUMANA: dependencia nueva — nombre: X, razón: Y]`
- Cambio en esquema de DB detectado: `[REQUIERE_APROBACIÓN_HUMANA: schema change]`
- Imposible implementar sin modificar BRAIN.md: `[REQUIERE_APROBACIÓN_HUMANA: decisión arquitectónica]`
- Test existente rompe sin explicación clara: NO silenciar — reportar al humano

## Nunca
- Push a `main`
- Merge de PR propio
- Modificar `AGENTS.md`, `CLAUDE.md`, o `docs/BRAIN.md`
- Eliminar o comentar tests que estaban pasando
- Usar `// @ts-ignore` sin comentario
- Ignorar errores de lint o typecheck — arreglarlos
