FROM node:20-bookworm-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm install -g pnpm@9.15.4
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json apps/api/package.json

RUN pnpm install --frozen-lockfile --filter api...

COPY apps/api apps/api

RUN pnpm --filter api exec prisma generate
RUN pnpm --filter api build

EXPOSE 4000

CMD ["pnpm", "--filter", "api", "start:prod"]
