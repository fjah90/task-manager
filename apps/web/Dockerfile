FROM node:20-bookworm-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm install -g pnpm@9.15.4

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json apps/web/package.json

RUN pnpm install --frozen-lockfile --filter web...

COPY apps/web apps/web

ARG API_INTERNAL_URL=http://task-manager-api:4000/api
ENV API_INTERNAL_URL=$API_INTERNAL_URL

RUN pnpm --filter web build

EXPOSE 3000

ENV HOSTNAME="0.0.0.0"
ENV PORT="3000"

CMD ["sh", "-c", "cd apps/web && node_modules/.bin/next start -H 0.0.0.0 -p 3000"]
