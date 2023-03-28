import { type LatLngBoundsLiteral } from "leaflet";

import type { KeywordType } from "@/api";

export const baseLayers = {
	"esri-world-imagery": {
		id: "esri-world-imagery",
		label: "Esri - World Imagery",
		url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
		attribution:
			"Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
	},
	"esri-world-terrain": {
		id: "esri-world-terrain",
		label: "Esri - World Terrain",
		url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}",
		attribution: "Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS",
		maxZoom: 13,
	},
	"esri-world-shaded-relief": {
		id: "esri-world-shaded-relief",
		label: "Esri - World Shaded Relief",
		url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}",
		attribution: "Tiles &copy; Esri &mdash; Source: Esri",
		maxZoom: 13,
	},
	"esri-world-physical": {
		id: "esri-world-physical",
		label: "Esri - World Physical",
		url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}",
		attribution: "Tiles &copy; Esri &mdash; Source: US National Park Service",
		maxZoom: 8,
	},
	dare: {
		id: "dare",
		label: "Digital Atlas of the Roman Empire",
		url: "https://dh.gu.se/tiles/imperium/{z}/{x}/{y}.png",
		attribution:
			"&copy; Johan Åhlfeldt, Centre for Digital Humanities, University of Gothenburg 2019. Contact: johan.ahlfeldt@lir.gu.se",
	},
	openstreetmap: {
		id: "openstreetmap",
		label: "OpenStreetMap",
		url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
		attribution:
			'&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
	},
};

export const config = {
	options: {
		minZoom: 2,
		maxZoom: 10,
		preferCanvas: true,
		zoomControl: false,
	},
	baseLayer: baseLayers["esri-world-imagery"],
};

const initialBounds: LatLngBoundsLiteral = [
	[34.016242, 5.488281],
	[71.663663, 34.667969],
];

export const initialViewState = {
	bounds: initialBounds,
};

// FIXME: do we use these?
export const colors = {
	cones: "hsl(50deg 100% 75%)",
	coneOrigins: "hsl(50deg 100% 75%)",
	linesPoints: "hsl(180deg 75% 50%)",
	areaHighlights: "hsl(0deg 75% 75%)",
	coneHighlights: "hsl(0deg 75% 75%)",
};

/** Area colors. */
export const keywordColors: Record<KeywordType, string> = {
	Keyword: "#039be5",
	Ethnonym: "#00897b",
	Name: "#ffb300",
	Region: "#43a047",
	unclear: "#9e9e9e",
};
