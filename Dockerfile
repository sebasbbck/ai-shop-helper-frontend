FROM oven/bun:1 AS base

WORKDIR /app

FROM base AS deps

COPY package.json bun.lock* ./
RUN bun install --no-save --frozen-lockfile

FROM base AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN bun run generate-client
RUN bun run build

FROM base AS runner

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

ARG BACKEND_URL="https://dev.aishophelper.ai/api/v1"

ENV NEXT_PUBLIC_BACKEND_URL=${BACKEND_URL}

ENV BACKEND_URL=${BACKEND_URL}

RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --no-log-init -g nodejs nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["bun", "./server.js"]
