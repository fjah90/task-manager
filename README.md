# Task Manager

App full-stack para gestión de tareas con autenticación. Cada usuario sólo accede a sus propias tareas.

> Prueba técnica — Full Stack Developer.

## Stack

- **Backend:** NestJS 11 + TypeScript estricto + Prisma 6 + PostgreSQL 16 + JWT (bcrypt 10 rounds) + Zod 4.
- **Frontend:** Next.js 16 (App Router, RSC) + React 19 + TypeScript + Tailwind v4 + TanStack Query 5 + React Hook Form 7 + Zod 4.
- **UI:** Lucide React (iconos), Sonner (toast notifications), SweetAlert2 (confirm dialogs).
- **Infra local:** Docker Compose (Postgres 16-alpine + API + Web + Nginx reverse proxy con SSL auto-firmado).
- **Monorepo:** pnpm workspaces.
- **Tests:** Jest (api), Vitest + Testing Library (web), Playwright (e2e).
- **CI:** GitHub Actions (lint + test en push/PR).
- **Docs API:** Swagger/OpenAPI (`/docs`).

## Estructura

```
apps/
├── api/   # NestJS + Prisma
│   ├── prisma/schema.prisma
│   └── src/
│       ├── common/       # filtros, pipes y decoradores transversales
│       ├── modules/
│       │   ├── auth/     # register/login + JWT strategy + guard
│       │   └── tasks/    # CRUD con aislamiento por userId
│       └── prisma/       # PrismaService global
└── web/   # Next.js
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/      # /login, /register
    │   │   └── (dashboard)/ # /tasks (protegida)
    │   ├── components/      # UI primitivos (Button, Input)
    │   ├── features/        # auth/, tasks/ (hooks + componentes)
    │   └── lib/             # api-client, schemas Zod
    └── e2e/                 # tests Playwright (fixtures + specs)
nginx/                       # reverse proxy + SSL auto-firmado
```

## Requisitos

- Node.js ≥ 20
- pnpm ≥ 9 (`corepack enable`)
- Docker Desktop

## Cómo correr

### Opción A — Docker Compose (recomendado)

```bash
# 1. Copiar envs
cp apps/api/.env.example apps/api/.env

# 2. Levantar todo (postgres + api + web + nginx)
docker-compose up -d

# 3. Aplicar migraciones
docker exec task-manager-api sh -c "cd apps/api && npx prisma migrate deploy"

# Abrir http://localhost:3000 (directo) o https://taskmanager.test (vía nginx)
# Para usar el dominio local, añadir a /etc/hosts (o C:\Windows\System32\drivers\etc\hosts):
#   127.0.0.1 taskmanager.test
```

### Opción B — Desarrollo local

```bash
# 1. Instalar dependencias
pnpm install

# 2. Levantar Postgres
pnpm db:up

# 3. Configurar envs
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# 4. Aplicar migraciones
pnpm --filter api exec prisma migrate dev --name init

# 5. Arrancar (en dos terminales)
pnpm dev:api   # http://localhost:4000  (prefijo /api)
pnpm dev:web   # http://localhost:3000
```

## Seed — usuario de prueba

Para cargar un usuario de prueba con 3 tareas de ejemplo:

```bash
pnpm db:seed
```

> La base de datos debe estar corriendo (`pnpm db:up`) y las migraciones aplicadas antes de ejecutar el seed.
> Si el usuario ya existe, el seed se omite sin error.

Credenciales del usuario de prueba:

| Campo    | Valor              |
| -------- | ------------------ |
| Email    | `test@example.com` |
| Password | `Test1234!`        |

## Tests

```bash
pnpm test                  # ambos paquetes
pnpm --filter api test     # sólo backend (Jest)
pnpm --filter web test     # sólo frontend (Vitest)
```

### Tests E2E (Playwright)

Requiere el stack Docker corriendo y el dominio `taskmanager.test` apuntando a `127.0.0.1`.

```bash
# 1. Levantar stack completo
docker-compose up -d

# 2. Ejecutar tests e2e
cd apps/web
npx playwright test
```

Los tests cubren: registro, login, logout, CRUD de tareas, filtros por status y flujo completo.

## Variables de entorno

`apps/api/.env`

| Variable        | Descripción                              |
| --------------- | ---------------------------------------- |
| `DATABASE_URL`  | Conexión Postgres                        |
| `JWT_SECRET`    | Secreto firma JWT                        |
| `JWT_EXPIRES_IN`| Expiración (ej. `1d`)                    |
| `PORT`          | Puerto Nest (default `4000`)             |
| `CORS_ORIGIN`   | Orígenes permitidos, separados por coma  |

`apps/web/.env.local`

| Variable               | Descripción                                       |
| ---------------------- | ------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`  | URL base del API, ej. `http://localhost:4000/api` |

## Endpoints

Todos bajo prefijo `/api`.

| Método | Ruta              | Auth | Descripción                                                                                  |
| ------ | ----------------- | ---- | -------------------------------------------------------------------------------------------- |
| POST   | `/auth/register`  | —    | `{ name, email, password }` → `{ token, user }`                                              |
| POST   | `/auth/login`     | —    | `{ email, password }` → `{ token, user }`                                                    |
| GET    | `/tasks`          | JWT  | Query: `status?`, `page` (default 1), `limit` (default 10, max 50) → `{ items, page, limit, total }` |
| GET    | `/tasks/:id`      | JWT  | 404 si no es del usuario                                                                     |
| POST   | `/tasks`          | JWT  | `{ title, description?, status?, dueDate? }`                                                 |
| PUT    | `/tasks/:id`      | JWT  | Body parcial (mín. 1 campo)                                                                  |
| DELETE | `/tasks/:id`      | JWT  | `{ id }`                                                                                     |
| GET    | `/health`         | —    | Health check                                                                                 |

Formato de error uniforme: `{ "error": { "code": "STRING_CODE", "message": "..." } }`.

## Rutas de documentación

- Frontend (app): `http://localhost:3000` (directo) / `https://taskmanager.test` (nginx)
- API base: `http://localhost:4000/api`
- Swagger UI: `http://localhost:4000/docs`
- OpenAPI JSON: `http://localhost:4000/docs-json`

## Decisiones técnicas

- **Aislamiento por usuario en la capa de servicio.** `TasksService` siempre filtra por `userId` extraído del JWT (`@CurrentUser`). El acceso cruzado devuelve **404** (no 403) para evitar enumeración de recursos.
- **Validación con Zod.** Una sola fuente de verdad por payload. En el back se aplica con `ZodValidationPipe`; en el front se usa el mismo schema con `@hookform/resolvers/zod`.
- **Errores tipados.** `HttpExceptionFilter` global serializa cualquier excepción a `{ error: { code, message } }`. `ZodError` mapea a 400 con `code: "VALIDATION_ERROR"`.
- **JWT en `localStorage`.** Decisión deliberada por simplicidad de la prueba (sin SSR de datos privados). Trade-off conocido: vulnerable a XSS; en producción se preferiría cookie `httpOnly` + CSRF token.
- **Prisma 6 en vez de 7.** Prisma 7 mueve la config del datasource a `prisma.config.ts`, fricción innecesaria para el alcance de la prueba.
- **Paginación cursor-free.** `findMany` + `count` en `$transaction` simple. Suficiente para los volúmenes esperados.
- **Estructura por features en el frontend.** `features/auth` y `features/tasks` agrupan hooks (TanStack Query) y componentes de presentación, separados de `components/` (primitivos reutilizables).
- **Diseño mobile-first.** Dashboard tipo lista (inspirado en apps nativas de tareas) con layout centrado `max-w-lg`, toggle de status inline, acciones en hover y botón "+ Agregar tarea" al pie.
- **Notificaciones.** Toasts con Sonner para feedback de operaciones CRUD; SweetAlert2 para confirmación de eliminación en lugar de `confirm()` nativo.
- **Nginx como reverse proxy con SSL.** Contenedor Nginx que termina HTTPS con certificado auto-firmado (SAN: `taskmanager.test`, `localhost`, `127.0.0.1`), redirige HTTP→HTTPS y enruta `/api/**` al backend y `/**` al frontend. Permite tests e2e sobre HTTPS en un dominio local realista.
- **CORS multi-origen.** `CORS_ORIGIN` soporta múltiples orígenes separados por coma, incluyendo `https://taskmanager.test` para el flujo vía nginx.
- **Cliente HTTP propio (`apiFetch`)** en lugar de Axios para reducir dependencias y mantener tipado estricto.

## Pendientes / fuera de alcance

- Refresh token / cookie httpOnly.
- Roles y permisos avanzados.
- Internacionalización (actualmente solo español).
- Deploy en producción (Vercel / Railway).

## Uso de IA

Ver [AI_USAGE.md](./AI_USAGE.md).
