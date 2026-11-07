# SPEC-013: Layout visual de páginas de autenticación

**ID:** SPEC-013
**Fecha:** 2026-11-07
**Autor:** human
**Estado:** BORRADOR
**Prioridad:** MEDIA
**Clasificación:** SIMPLE

---

## Contexto

### Por qué
Las páginas `/sign-in` y `/sign-up` renderizan el componente de Clerk alineado a la esquina superior izquierda sin ningún layout. El resultado es visualmente incorrecto — el formulario flota sin contexto en una página en blanco.

### Qué problema resuelve
Estado actual: formulario de Clerk top-left, sin fondo, sin centrado, sin Tabler CSS activo en ninguna parte de la app.
Estado deseado: formulario centrado vertical y horizontalmente en pantalla completa, con fondo neutro de Tabler; Tabler CSS importado globalmente.

### Decisiones de BRAIN.md consultadas
- [x] CSS: Tabler Core (Bootstrap-based) — framework designado, no instalado aún
- [x] Server Components por defecto — layout puede ser Server Component
- [x] No `'use client'` salvo necesidad explícita

---

## Criterios de Aceptación

1. DADO el dev server corriendo
   CUANDO el usuario navega a `/sign-in` o `/sign-up`
   ENTONCES el formulario de Clerk aparece centrado vertical y horizontalmente en la pantalla

2. DADO que Tabler CSS está importado globalmente
   CUANDO cualquier página carga
   ENTONCES los estilos base de Tabler (reset, tipografía, colores) están activos

3. DADO el layout de páginas de auth
   CUANDO la ventana se redimensiona a móvil (< 576px)
   ENTONCES el formulario permanece centrado y no desborda el viewport

---

## Alcance

### Incluido
- Instalar `@tabler/core` (Tabler CSS + JS)
- Importar `@tabler/core/dist/css/tabler.min.css` en `app/layout.tsx`
- Crear `app/(public)/layout.tsx` — layout compartido para sign-in y sign-up con centrado full-screen
- Mover `app/sign-in/` y `app/sign-up/` bajo el grupo de rutas `app/(public)/`

### EXPLÍCITAMENTE EXCLUIDO
- Branding/logo propio en las páginas de auth — spec futura
- Customización visual del componente Clerk (colores, fuentes) — spec futura
- Layout para páginas del grupo `(auth)` (dashboard, proyectos) — spec futura
- Modo oscuro — spec futura
- Animaciones o transiciones

---

## Subtareas

| # | Descripción | Criterio de verificación | Estimación |
|---|-------------|--------------------------|------------|
| 1 | Instalar `@tabler/core` e importar CSS en `app/layout.tsx` | Tabler reset/tipografía visible en cualquier página | 0.10h |
| 2 | Crear grupo `(public)` y mover sign-in/sign-up | `/sign-in` y `/sign-up` siguen funcionando tras el movimiento | 0.10h |
| 3 | Crear `app/(public)/layout.tsx` con contenedor centrado | Formulario Clerk centrado en pantalla, responsive en móvil | 0.15h |

---

## Decisiones de Diseño Ya Tomadas

- Grupo de rutas `(public)`: agrupa páginas públicas (auth) sin layout protegido; el nombre no afecta URLs
- Centrado con Tabler: usar clase `page page-center` de Tabler que es exactamente un full-screen flex centrado
- `@tabler/core` vía npm (no CDN): consistente con el resto del stack, permite tree-shaking futuro
- No crear `app/(public)/page.tsx` — `/` sigue siendo 404 hasta spec de landing

---

## Archivos Esperados a Modificar

- `package.json` / `package-lock.json` ← instalar `@tabler/core`
- `app/layout.tsx` ← agregar import CSS de Tabler
- `app/(public)/layout.tsx` ← nuevo
- `app/(public)/sign-in/[[...sign-in]]/page.tsx` ← movido desde `app/sign-in/`
- `app/(public)/sign-up/[[...sign-up]]/page.tsx` ← movido desde `app/sign-up/`
- `app/sign-in/` ← eliminar (movido)
- `app/sign-up/` ← eliminar (movido)

---

## Dependencias

- [x] SPEC-012: páginas sign-in/sign-up creadas — completada (PR #15)
