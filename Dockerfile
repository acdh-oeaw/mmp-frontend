# syntax=docker/dockerfile:1

# build
FROM node:26.13.1-slim AS build

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

COPY --chown=node:node package.json ./
RUN <<'SH'
set -eu
node --input-type=module <<'JS'
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import manifest from "./package.json" with { type: "json" };

const { version } = manifest.devEngines.packageManager;
const url = `https://github.com/pnpm/pnpm/releases/download/v${version}/pnpm-linux-${process.arch}.tar.gz`;
const response = await fetch(url);
if (!response.ok) {
  throw new Error(`Downloading pnpm failed with HTTP ${response.status}`);
}
await pipeline(response.body, createWriteStream("/tmp/pnpm.tar.gz"));
JS
mkdir -p /opt/pnpm
tar -xzf /tmp/pnpm.tar.gz -C /opt/pnpm
rm /tmp/pnpm.tar.gz
ln -s /opt/pnpm/pnpm /usr/local/bin/pnpm
pnpm --version
SH

USER node

COPY --chown=node:node ./ ./

RUN CI=true pnpm install --frozen-lockfile

ENV NODE_ENV=production

ARG NUXT_PUBLIC_API_BASE_URL
ARG NUXT_PUBLIC_APP_BASE_URL
ARG NUXT_PUBLIC_BOTS
ARG NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION
ARG NUXT_PUBLIC_MATOMO_BASE_URL
ARG NUXT_PUBLIC_MATOMO_ID
ARG NUXT_PUBLIC_REDMINE_ID

RUN pnpm run build

# serve
FROM node:26.13.1-slim AS serve

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --from=build --chown=node:node /app/.output ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "./server/index.mjs"]
