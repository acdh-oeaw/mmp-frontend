# MMP Frontend

Web frontend for the [MMP project](https://github.com/acdh-oeaw/mmp). Deployed at
<https://mmp-frontend.acdh-dev.oeaw.ac.at>.

## Project setup

Install dependencies:

```bash
npm install
```

Set environment variables:

```
cp .env.example .env.local
```

### Compile and hot-reload for development

```bash
npm run dev
```

To develop against a local backend instance, follow
[the backend development guidelines](https://github.com/acdh-oeaw/mmp/blob/master/CONTRIBUTING.md),
and set the `VITE_APP_MMP_API_BASE_URL` environment variable in `.env.local` to
"http://localhost:8000".

### Compile and minify for production

```bash
npm run build
```

### Format files

```bash
npm run format:fix
```

### Lint and fix JavaScript and CSS files

```bash
npm run lint:fix
```
