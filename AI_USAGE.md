# AI Usage

Durante esta prueba se utilizó **GitHub Copilot (Claude 4.6, GPTCodex 5.3)** como asistente de pair-programming. Este documento resume cómo, dónde y bajo qué controles.
**GitHub Copilot (Gemini 3.1)** en la documentación.

## Dónde aportó

- **Andamiaje.** Scaffolding inicial de NestJS y Next.js, configuración de Tailwind v4, TanStack Query y Vitest.
- **Boilerplate repetitivo.** `ZodValidationPipe`, `HttpExceptionFilter`, decorador `@CurrentUser`, layouts de Next.
- **Espejo de schemas Zod** front/back para mantener la misma forma de payloads.
- **Componentes UI primitivos** (`Button`, `Input`, `TaskCard`, `TaskForm`).
- **Redacción técnica** de README y comentarios cortos cuando aportan valor.
- **Diseño visual.** Extracción de paleta de colores a partir del logo (teal/charcoal), configuración de CSS custom properties y aplicación consistente en todos los componentes.
- **Debugging Docker.** Diagnóstico de problemas de red en contenedores (binding `0.0.0.0`, CORS multi-origen, diferencia `localhost` vs `127.0.0.1`).

## Dónde NO se delegó (decisiones humanas)

- **Arquitectura de seguridad:** aislamiento por `userId` en `TasksService`, devolver 404 (no 403) para acceso cruzado, formato de error uniforme.
- **Contrato del API** (paths, códigos, paginación) y decisión de mantener JWT en `localStorage` con el trade-off explícito.
- **Selección de stack y versiones** (degradar de Prisma 7 → 6 por la incompatibilidad de config).
- **Estrategia de tests:** qué cubrir primero (ownership en backend, validación + happy path de login en frontend).
- **Estructura del monorepo** (pnpm workspaces, separación `features/` vs `components/`).
- **Identidad visual:** elección del logo, validación de la paleta y decisión del layout mobile-first.

## Controles aplicados

- **Revisión línea a línea** de cualquier sugerencia antes de aceptarla; reescritura cuando el patrón sugerido no encajaba con la arquitectura.
- **TypeScript estricto** (`noImplicitAny`, etc.) y **ESLint** como red de seguridad — toda salida de IA pasa por ambos.
- **Tests deterministas** (`pnpm test`) ejecutados después de cada bloque relevante para detectar regresiones temprano.
- **Commits atómicos** con Conventional Commits para que el historial refleje decisiones humanas, no volcados de IA.
- **Sin secretos en prompts ni en el repo.** `.env*` ignorados; sólo se versionan `.env.example`.
- **Validación Docker** después de cada cambio: build + recreate container + verificar endpoints antes de continuar.

## Prompts representativos

- _"Diseña un `HttpExceptionFilter` global que serialice cualquier error a `{ error: { code, message } }` y mapee `ZodError` a 400."_
- _"En el `TasksController`, asegúrate de que todas las operaciones reciben el `userId` desde `@CurrentUser` y de que el servicio filtra siempre por ese campo."_
- _"Genera un test de Vitest + Testing Library para `LoginForm` que cubra validación de email y submit feliz mockeando `fetch`."_

## Algo que la IA hizo mal y cómo se corrigió

- **SVG del logo:** al pedirle que recreara el logo como SVG, generó un icono genérico que no se parecía en nada al original. Se descartó y se usó directamente el PNG real.
- **CORS hardcodeado:** el primer approach hardcodeó orígenes en `main.ts` además de la variable de entorno, creando redundancia. Se refactorizó para leer únicamente de `CORS_ORIGIN` (comma-separated).
- **Duplicación de función:** al agregar toasts, dejó una función `useDeleteTask` duplicada que rompió el build. Se detectó en el build de Docker y se eliminó.

## Resultado

La IA aceleró tareas de bajo riesgo (boilerplate, UI, docs, debugging Docker). Las decisiones de diseño, seguridad y contrato del API se tomaron y validaron manualmente.
