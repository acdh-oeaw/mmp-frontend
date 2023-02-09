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
			link: [
				{ href: "/favicons.ico", rel: "icon", sizes: "any" },
				{ href: "/apple-touch-icon.png", rel: "apple-touch-icon" },
				{ href: "/" + manifestFileName, rel: "manifest" },
			],
			meta: [
				{ name: "description", content: metadata.description },
				{ property: "og:type", content: "website" },
				{ property: "og:title", content: metadata.title },
				{ property: "og:description", content: metadata.description },
				{ property: "og:image", content: "/" + openGraphImageName },
				{ property: "og:locale", content: metadata.locale },
			],
			title: metadata.title,
			titleTemplate(title) {
				return [title, metadata.title].join(" - ");
			},
		},
	},
	css: [
		"@fontsource/roboto-flex/variable-full.css",
		"tailwindcss/tailwind.css",
		"@/styles/index.css",
	],
	imports: {
		autoImport: false,
	},
	// modules: ["@nuxtjs/tailwindcss"],
	postcss: {
		plugins: {
			"postcss-custom-media": {},
			"tailwindcss/nesting": "postcss-nesting",
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	srcDir: "./src/",
	typescript: {
		shim: false,
		strict: true,
	},
});
