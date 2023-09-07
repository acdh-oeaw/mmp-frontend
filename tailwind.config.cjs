/** @typedef {import('tailwindcss').Config} TailwindConfig */

const colors = require("tailwindcss/colors");
const headlessui = require("@headlessui/tailwindcss");
const typography = require("@tailwindcss/typography");

const neutral = colors.slate;
const primary = colors.slate;
const negative = colors.red;

/** @type {TailwindConfig} */
const config = {
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
				sans: ["Roboto Flex Variable", "ui-sans-serif", "system-ui", "sans-serif"],
			},
		},
	},
};

module.exports = config;
