# syntax=docker/dockerfile:1

# build
FROM node:18-slim AS build

RUN corepack enable

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node env.d.ts index.html tsconfig.json vite.config.ts ./
COPY --chown=node:node scripts ./scripts
COPY --chown=node:node public ./public
COPY --chown=node:node config ./config
COPY --chown=node:node src ./src

ARG VITE_APP_BASE_URL
ARG VITE_APP_MMP_API_BASE_URL
ARG VITE_APP_REDMINE_ID
ARG VITE_APP_MATOMO_BASE_URL
ARG VITE_APP_MATOMO_ID

RUN npm install --ci --no-audit --no-fund

ENV NODE_ENV=production

RUN npm run build

# serve
FROM caddy:2-alpine AS serve

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv

EXPOSE 8080

