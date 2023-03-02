/** @typedef {import('tailwindcss').Config} TailwindConfig */

const colors = require("tailwindcss/colors");
const headlessui = require("@headlessui/tailwindcss");
const lineclamp = require("@tailwindcss/line-clamp");
const typography = require("@tailwindcss/typography");

const neutral = colors.slate;
const primary = colors.slate;
const negative = colors.red;

/** @type {TailwindConfig} */
const config = {
	content: ["./src/**/*.@(css|ts|vue)"],
	plugins: [headlessui, lineclamp, typography],
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

module.exports = config;
