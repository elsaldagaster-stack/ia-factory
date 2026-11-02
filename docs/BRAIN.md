# BRAIN.md — Cerebro del Proyecto

**IMPORTANTE:** Solo el revisor humano puede modificar este archivo.
Los agentes lo leen pero nunca lo modifican.

Última actualización: 2026-11-02

---

## Stack Tecnológico

- Lenguaje principal: TypeScript 5.x
- Runtime: Node.js 20.x (LTS)
- Framework: [completar — Express / Fastify / NestJS / ninguno]
- Base de datos: [completar]
- ORM/Query builder: [completar si aplica]
- Hosting/Infraestructura: [completar]

## Decisiones Arquitectónicas

Referencia a ADRs en `docs/decisions/`:
- [001] TBD Policy: Trunk-Based Development, max 24h de vida por rama

## Patrones de Código

- Nomenclatura: camelCase para variables/funciones, PascalCase para tipos/clases, UPPER_SNAKE_CASE para constantes
- Funciones: preferir funciones puras, sin side effects cuando sea posible
- Manejo de errores: lanzar errores tipados, nunca silenciar con catch vacío
- Async: siempre async/await, nunca callbacks anidados
- Imports: named exports preferidos sobre default exports
- Tests: Jest + ts-jest, describe/it, un assert lógico por test

## Lo que NO hacemos

- No usar `any` en TypeScript (usar `unknown` y type guards)
- No usar `// @ts-ignore` (usar `// @ts-expect-error` con comentario)
- No callbacks anidados — usar async/await
- No variables globales mutables
- No lógica de negocio en archivos de test
- No tests que dependen del orden de ejecución
- No hardcodear valores de configuración (usar variables de entorno)

## Dependencias Externas

[Completar cuando se agreguen dependencias]
- [Servicio]: [para qué se usa, nivel de criticidad]

## Estado Actual del Sistema

- Fase: 0 — Fundaciones
- Componentes en producción: ninguno aún
- Deuda técnica conocida: ninguna (proyecto nuevo)
- Áreas frágiles: N/A

## Límite de tamaño: 500 líneas máximo
