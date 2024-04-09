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
