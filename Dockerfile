# syntax=docker/dockerfile:1

# build
FROM node:20-slim AS build

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --chown=node:node .npmrc package.json package-lock.json ./

COPY --chown=node:node ./ ./

RUN npm install --ci --no-audit --no-fund

ENV NODE_ENV=production

ARG VITE_APP_API_BASE_URL
ARG VITE_APP_BASE_URL
ARG VITE_APP_MATOMO_BASE_URL
ARG VITE_APP_MATOMO_ID
ARG VITE_APP_REDMINE_ID

RUN npm run build

# serve
FROM node:20-slim AS serve

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --from=build --chown=node:node /app/.output ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "./server/index.mjs"]
