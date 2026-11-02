# ADR 001: Trunk-Based Development

**Fecha:** 2026-11-02
**Estado:** Aceptado

## Contexto

El factory genera código a través de agentes. Sin disciplina de branching, el estado de main se vuelve impredecible y los conflictos de merge consumen tiempo humano.

## Decisión

Usamos Trunk-Based Development (TBD).

### Reglas

- Ramas de features tienen vida máxima de **24 horas**
- Máximo **3 ramas activas** simultáneamente (excluyendo `factory/`)
- Features grandes se implementan con **feature flags**, no con ramas de larga duración
- Los agentes siempre crean PRs — nunca pushean directamente a `main`
- Las ramas `factory/` están exentas del límite de 3 (tienen tracking en Kanban)
- Naming de ramas del factory: `factory/SPEC-[ID]-[nombre-descriptivo-corto]`

## Consecuencias

- Integraciones frecuentes → conflictos pequeños en lugar de conflictos grandes
- Feature flags son un prerequisito para features que toman más de 24 horas
- El WIP limit del Kanban (máx 2 en IMPLEMENTATION) refuerza este límite naturalmente

## Alternativas consideradas

- **Feature branches de larga duración:** Descartado — conflictos de merge costosos con múltiples agentes trabajando en paralelo
- **Gitflow:** Descartado — overhead de gestión de ramas incompatible con velocidad de factory

## Respaldo empírico

DORA 2024 identifica TBD como práctica diferenciadora de equipos de alto rendimiento.
