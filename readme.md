# MMP Frontend

Web frontend for the [MMP project](https://github.com/acdh-oeaw/mmp). Deployed at
<https://mmp.acdh.oeaw.ac.at>.

## How to run
Prerequisites: [Node.js v20](https://nodejs.org/en/download) and [npm v10](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Set required environment variables in `.env`:

```bash
# Unix
cp .env.local.example .env.local

# Windows
copy .env.local.example .env.local
```

Install dependencies:

```bash
npm i
```

Run a development server on [http://localhost:3000](http://localhost:3000):

```bash
npm run dev
```
Build for production:
```bash
npm run build
```

## How to deploy
Commits pushed to the `main` branch will automatically be deployed to the ACDH-CH cluster via GitHub Actions.
