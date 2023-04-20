import { fileURLToPath } from "node:url";

import { defineNuxtConfig } from "nuxt/config";

import { manifestFileName, metadata, openGraphImageName } from "./config/metadata.config";

export default defineNuxtConfig({
	alias: {
		"@": fileURLToPath(new URL("./src", import.meta.url)),
		"~": fileURLToPath(new URL(".", import.meta.url)),
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
		"@fontsource/roboto-flex/variable-full.css",
		"tailwindcss/tailwind.css",
		"@/styles/index.css",
	],
	dir: {
		public: "../public",
	},
	imports: {
		autoImport: false,
	},
	modules: ["@nuxt/image-edge"],
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
	srcDir: "./src/",
	typescript: {
		shim: false,
		strict: true,
	},
	vite: {
		esbuild: {
			define: {
				/** Statically replace `process.env.NODE_ENV` in `@stefanprobst/assert`. */
				"process.env.NODE_ENV": JSON.stringify(process.env["NODE_ENV"]),
			},
		},
	},
});
