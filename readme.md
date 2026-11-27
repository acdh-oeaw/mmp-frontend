# MMP Frontend

Web frontend for the [MMP project](https://github.com/acdh-oeaw/mmp). Deployed at
<https://mmp.acdh.oeaw.ac.at>.

## How to run

Use the [Node.js](https://nodejs.org/en/download) and [pnpm](https://pnpm.io/installation) versions
pinned in `package.json` under `devEngines`.

Set required environment variables in `.env.local`:

```bash
# Unix
cp .env.local.example .env.local

# Windows
copy .env.local.example .env.local
```

Install dependencies:

```bash
pnpm install --frozen-lockfile
```

Run a development server on [http://localhost:3000](http://localhost:3000):

```bash
pnpm run dev
```

Build for production:

```bash
pnpm run build
```

## How to deploy

Commits pushed to the `main` branch will automatically be deployed to the ACDH-CH cluster via GitHub
Actions.
