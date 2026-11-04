# SPEC-005: lib/email — Wrapper de Resend para envío de emails

**ID:** SPEC-005
**Fecha:** 2026-11-04
**Autor:** human
**Estado:** APROBADA
**Prioridad:** MEDIA
**Clasificación:** SIMPLE

---

## Contexto

### Por qué
La app necesita enviar emails transaccionales (bienvenida, notificaciones). Sin un wrapper centralizado, cada Server Action o Route Handler inicializaría su propio cliente Resend, duplicando la lógica de error handling y el manejo de API key.

### Qué problema resuelve
Estado actual: no existe ninguna abstracción de email.
Estado deseado: función `sendEmail()` en `lib/email/index.ts` usable desde cualquier Server Action o Route Handler, con manejo de errores consistente.

### Decisiones de BRAIN.md consultadas
- [x] Resend: templates en `lib/email/templates/`, envío solo desde Server Actions o Route Handlers
- [x] No dependencias nuevas — `resend` ya instalado (`^6.37.0`)
- [x] Async/await, nunca callbacks
- [x] No `any` — tipos explícitos

---

## Criterios de Aceptación

1. DADO parámetros válidos `{ to, subject, html }`
   CUANDO se llama `sendEmail(params)`
   ENTONCES llama a `resend.emails.send` con los parámetros correctos y retorna `{ success: true, id }`

2. DADO que Resend retorna un objeto `error` (error de API)
   CUANDO se llama `sendEmail(params)`
   ENTONCES retorna `{ success: false, error: mensaje }`

3. DADO que `resend.emails.send` lanza una excepción
   CUANDO se llama `sendEmail(params)`
   ENTONCES retorna `{ success: false, error: mensaje }` sin propagar la excepción

4. DADO que no se pasa `from`
   CUANDO se llama `sendEmail(params)`
   ENTONCES usa el sender default configurado en `RESEND_FROM_EMAIL` (variable de entorno)

5. DADO un array de destinatarios
   CUANDO se llama `sendEmail({ to: ['a@x.com', 'b@x.com'], ... })`
   ENTONCES pasa el array a Resend sin modificaciones

---

## Alcance

### Incluido
- `lib/email/index.ts` — función `sendEmail` + tipos `SendEmailParams` / `SendEmailResult`
- `RESEND_FROM_EMAIL` documentado en `.env.example`

### EXPLÍCITAMENTE EXCLUIDO
- Templates de email (specs futuras en `lib/email/templates/`)
- Emails en cola o reintentos automáticos
- Preview de emails en desarrollo
- Attachments

---

## Subtareas

| # | Descripción | Criterio de verificación | Estimación |
|---|-------------|--------------------------|------------|
| 1 | Escribir tests con `vi.mock('resend')` | Tests en rojo (módulo no existe) | 0.25h |
| 2 | Implementar `sendEmail` con lazy Resend client | Tests en verde | 0.25h |
| 3 | Documentar `RESEND_FROM_EMAIL` en `.env.example` | Variable presente | 0.10h |

---

## Decisiones de Diseño Ya Tomadas

- Resend client inicializado lazily dentro de `sendEmail` — evita crash en import si `RESEND_API_KEY` no está seteada (ej: en tests)
- `from` default via `RESEND_FROM_EMAIL` env var — no hardcodear dominio en código (el dominio verificado en Resend puede cambiar)
- Si `RESEND_API_KEY` o `RESEND_FROM_EMAIL` no están seteadas → `sendEmail` retorna `{ success: false, error: '...' }` sin lanzar
- Resultado siempre es `SendEmailResult` — nunca lanza, el caller decide cómo manejar el fallo
- `to` acepta `string | string[]` — mismo tipo que acepta Resend

---

## Archivos Esperados a Modificar

- `lib/email/index.ts` ← nuevo
- `tests/unit/email.test.ts` ← nuevo
- `.env.example` ← agregar `RESEND_FROM_EMAIL`

---

## Dependencias

- Ninguna dependencia de otras specs.
