import type { Config } from 'tailwindcss'

import colors from "tailwindcss/colors"
import headlessui from "@headlessui/tailwindcss"
import typography from "@tailwindcss/typography"

const neutral = colors.slate;
const primary = colors.slate;
const negative = colors.red;

const config: Config = {
	content: ["./src/**/*.@(css|ts|vue)"],
	plugins: [headlessui, typography],
	theme: {
		extend: {
			colors: {
				neutral,
				primary,
				negative,
			},
			fontFamily: {
				sans: ["Roboto FlexVariable", "ui-sans-serif", "system-ui", "sans-serif"],
			},
		},
	},
};

export default config;
