import type { FitEnum } from "sharp";

type Locale = "en";

interface Metadata {
	locale: Locale;
	title: string;
	shortTitle: string;
	description: string;
	logo: {
		path: string;
		fit: keyof FitEnum;
		maskable: boolean;
	};
	image: {
		path: string;
		fit: keyof FitEnum;
	};
	twitter: {
		handle: string;
	};
	creator: {
		name: string;
		shortName: string;
		website: string;
	};
}

export const metadata: Metadata = {
	locale: "en",
	title: "Mapping Medieval Peoples",
	shortTitle: "MMP",
	description: "Visualising Semantic Landscapes in Early Medieval Europe",
	logo: {
		path: "./public/assets/images/logo.svg",
		fit: "contain",
		maskable: false,
	},
	image: {
		path: "./public/assets/images/logo.svg",
		fit: "contain",
	},
	twitter: {
		handle: "",
	},
	creator: {
		name: "Austrian Centre for Digital Humanities and Cultural Heritage",
		shortName: "ACDH-CH",
		website: "https://www.oeaw.ac.at/acdh",
	},
};

export const manifestFileName = "app.webmanifest";

export const openGraphImageName = "image.webp";
