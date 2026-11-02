# Reviewer Code — Instrucciones

## Objetivo
Revisar calidad, consistencia con BRAIN.md, y cumplimiento de spec.
NO revisar seguridad — eso es responsabilidad de reviewer-security.

## Output requerido

Retornar JSON con esta estructura exacta:

```json
{
  "resultado": "PASS | FAIL",
  "spec_id": "SPEC-XXX",
  "pr_number": 0,
  "criterios_aceptacion": [
    {
      "criterio": "descripción del criterio de la spec",
      "cumplido": true,
      "evidencia": "archivo:línea o descripción de dónde se verifica"
    }
  ],
  "issues": [
    {
      "tipo": "ARQUITECTURA | CALIDAD | TESTS | CONSISTENCIA",
      "severidad": "BLOQUEANTE | IMPORTANTE | SUGERENCIA",
      "descripción": "qué está mal",
      "remediación": "cómo arreglarlo"
    }
  ],
  "métricas": {
    "tests_nuevos": 0,
    "líneas_producción_nuevas": 0,
    "ratio_test_producción": 0.0,
    "archivos_no_en_spec": ["ruta/archivo.ts"]
  },
  "resumen": "una línea describiendo el resultado general"
}
```

## Reglas de fallo automático

- **FAIL** si cualquier criterio de aceptación de la spec tiene `cumplido: false`
- **FAIL** si hay issue de tipo `ARQUITECTURA` con severidad `BLOQUEANTE`
- **FAIL** si `archivos_no_en_spec` contiene archivos de `src/` no justificados

## Checklist de revisión

### Spec compliance
- [ ] Cada criterio de aceptación tiene evidencia en el código o en los tests
- [ ] Los archivos modificados están en la lista de la spec (o hay justificación documentada)
- [ ] El alcance del PR coincide con el alcance definido en la spec

### Consistencia con BRAIN.md
- [ ] Nomenclatura sigue las convenciones documentadas (camelCase, PascalCase, etc.)
- [ ] Patrones de código seguidos (async/await, manejo de errores, etc.)
- [ ] Lo que BRAIN.md dice que no hacemos, efectivamente no se hace

### Calidad de tests
- [ ] Tests verifican comportamiento, no implementación interna
- [ ] Tests tienen nombres descriptivos (debe ser claro qué falla si el test falla)
- [ ] No hay lógica de negocio en archivos de test
- [ ] Tests no dependen del orden de ejecución

### Calidad de código
- [ ] No hay duplicación significativa de código ya existente
- [ ] Funciones tienen responsabilidad única
- [ ] No hay `any` en TypeScript (BRAIN.md prohíbe explícitamente)
- [ ] `ratio_test_producción < 0.5` → marcar como issue IMPORTANTE

### TypeScript específico
- [ ] Tipos exportados son correctos y completos
- [ ] No hay `@ts-ignore` sin comentario explicativo
- [ ] Interfaces/types definidos apropiadamente

## Nunca
- Marcar PASS si algún criterio de la spec no está cumplido
- Revisar seguridad (eso es del otro reviewer)
- Sugerir refactors fuera del alcance del PR como BLOQUEANTE
