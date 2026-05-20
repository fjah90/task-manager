# Task Manager

App full-stack para gestión de tareas con autenticación. Cada usuario sólo accede a sus propias tareas.

> Prueba técnica — Full Stack Developer.

## Stack

- **Backend:** NestJS + TypeScript + Prisma + PostgreSQL + JWT (bcrypt) + Zod.
- **Frontend:** Next.js 15 (App Router) + React 19 + TypeScript + Tailwind v4 + TanStack Query + React Hook Form + Zod.
- **Infra local:** Docker Compose (Postgres 16).
- **Monorepo:** pnpm workspaces.

## Estructura

```
apps/
├── api/   # NestJS + Prisma
└── web/   # Next.js
```

## Requisitos

- Node.js ≥ 20
- pnpm ≥ 9 (`corepack enable && corepack prepare pnpm@latest --activate`)
- Docker Desktop

## Cómo correr

```bash
# 1. Instalar dependencias
pnpm install

# 2. Levantar Postgres
pnpm db:up

# 3. Configurar envs (copiar y ajustar)
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# 4. Migraciones
pnpm --filter api prisma migrate dev

# 5. Arrancar (en dos terminales)
pnpm dev:api   # http://localhost:4000
pnpm dev:web   # http://localhost:3000
```

## Tests

```bash
pnpm test                  # ambos paquetes
pnpm --filter api test     # sólo backend
pnpm --filter web test     # sólo frontend
```

## Variables de entorno

Ver `apps/api/.env.example` y `apps/web/.env.example`.

## Decisiones técnicas

_(Se completarán al finalizar la implementación.)_

## Pendientes / fuera de alcance

_(Se completarán al finalizar la implementación.)_
