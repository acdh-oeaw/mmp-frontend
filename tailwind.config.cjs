/** @typedef {import('tailwindcss').Config} TailwindConfig */

const colors = require("tailwindcss/colors");
const typography = require("@tailwindcss/typography");

const neutral = colors.slate;
const negative = colors.red;
const primary = "#0f1226";
const background = "#f1f5fa";

/** @type {TailwindConfig} */
const config = {
	content: ["./src/**/*.@(css|ts|vue)"],
	plugins: [typography],
	theme: {
		extend: {
			colors: {
				neutral,
				negative,
				primary,
				background,
			},
			fontFamily: {
				sans: ["Roboto FlexVariable", "ui-sans-serif", "system-ui", "sans-serif"],
				display: ["Times New Roman", "Times", "ui-serif", "serif"],
			},
		},
	},
};

module.exports = config;
