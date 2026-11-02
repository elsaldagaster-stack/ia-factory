# ADR 002: Thermos Review Integration

**Fecha:** 2026-11-02
**Estado:** Aceptado

## Contexto

Thermos es un orquestador de revisión paralela (correctness/security + code quality) que usa dos agentes simultáneos. Integrado en dos puntos del flujo:

## Decisiones

### Factory (agente builder)
Thermos corre en el paso 5 de builder.md — después de todas las verificaciones técnicas (type-check, lint, tests) y antes de abrir el PR.

Punto elegido porque: el builder tiene el diff completo de la implementación, puede autocorregir issues críticos antes de exponer el PR a revisión humana o automática.

### Commits humanos (pre-push hook)
Thermos corre como pre-push hook en `.githooks/pre-push` — solo en ramas no-factory, solo si diff ≥ 10 líneas.

Pre-push elegido sobre pre-commit porque: el builder hace commits atómicos por subtarea (TDD). Correr thermos en cada commit pequeño es ruidoso y lento.

## Setup requerido (una sola vez por clon)

```bash
git config core.hooksPath .githooks
chmod +x .githooks/pre-push   # solo en Mac/Linux
```

En Windows con Git Bash, `chmod` no es necesario si el archivo tiene permisos de lectura.

## Comportamiento del hook

| Situación | Acción |
|-----------|--------|
| Rama `factory/*` | Skip — builder.md lo maneja |
| Rama `main`/`master` | Bloquea push directo |
| Diff < 10 líneas | Skip — trivialmente pequeño |
| `claude` CLI no encontrado | Advertencia + confirmación manual |
| Thermos APPROVE | Push procede automáticamente |
| Thermos REQUEST CHANGES | Muestra findings, pide confirmación |

## Alternativa considerada

Pre-commit hook: descartado — muy frecuente para TDD (commits atómicos), genera falsos positivos en implementaciones parciales.
