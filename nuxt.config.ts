import { fileURLToPath } from "node:url";

import { defineNuxtConfig } from "nuxt/config";

import { manifestFileName, metadata, openGraphImageName } from "./config/metadata.config";

export default defineNuxtConfig({
	alias: {
		"@": fileURLToPath(new URL("./", import.meta.url)),
	},
	app: {
		head: {
			htmlAttrs: {
				lang: "en",
			},
			link: [
				{ href: "/favicon.ico", rel: "icon", sizes: "any" },
				{ href: "/apple-touch-icon.png", rel: "apple-touch-icon" },
				{ href: "/" + manifestFileName, rel: "manifest" },
			],
			meta: [
				{ name: "description", content: metadata.description },
				{ property: "og:type", content: "website" },
				{ property: "og:title", content: metadata.title },
				{ property: "og:site_name", content: metadata.title },
				{ property: "og:description", content: metadata.description },
				{ property: "og:image", content: "/" + openGraphImageName },
				{ property: "og:locale", content: metadata.locale },
				process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION
					? {
							name: "google-site-verification",
							content: process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
						}
					: {},
			],
		},
	},
	components: false,
	css: [
		"@fontsource-variable/roboto-flex/standard.css",
		"tailwindcss/tailwind.css",
		"@/styles/index.css",
	],
	imports: {
		autoImport: false,
	},
	modules: ["@nuxt/image"],
	nitro: {
		compressPublicAssets: true,
	},
	postcss: {
		plugins: {
			"tailwindcss/nesting": "postcss-nesting",
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	routeRules: {
		"/": { static: true },
		"/about": { static: true },
		"/imprint": { static: true },
	},
	runtimeConfig: {
		NODE_ENV: process.env.NODE_ENV,
		public: {
			NUXT_PUBLIC_API_BASE_URL: process.env.NUXT_PUBLIC_API_BASE_URL,
			NUXT_PUBLIC_APP_BASE_URL: process.env.NUXT_PUBLIC_APP_BASE_URL,
			NUXT_PUBLIC_BOTS: process.env.NUXT_PUBLIC_BOTS,
			NUXT_PUBLIC_MATOMO_BASE_URL: process.env.NUXT_PUBLIC_MATOMO_BASE_URL,
			NUXT_PUBLIC_MATOMO_ID: process.env.NUXT_PUBLIC_MATOMO_ID,
			NUXT_PUBLIC_REDMINE_ID: process.env.NUXT_PUBLIC_REDMINE_ID,
		},
	},
	typescript: {
		shim: false,
		strict: true,
		tsConfig: {
			compilerOptions: {
				paths: {
					"@/*": ["./*"],
				},
			},
		},
	},
});
