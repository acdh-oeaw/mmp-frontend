import headlessui from "@headlessui/tailwindcss";
import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const neutral = colors.slate;
const primary = colors.slate;
const negative = colors.red;

const config: Config = {
	content: [
		"./app.vue",
		"./error.vue",
		"./components/**/*.@(css|ts|vue)",
		"./content/**/*.md",
		"./layouts/**/*.@(css|ts|vue)",
		"./pages/**/*.@(css|ts|vue)",
	],
	plugins: [headlessui, typography],
	theme: {
		extend: {
			colors: {
				neutral,
				primary,
				negative,
			},
			fontFamily: {
				sans: ["Roboto Flex Variable", "ui-sans-serif", "system-ui", "sans-serif"],
			},
		},
	},
};

export default config;
