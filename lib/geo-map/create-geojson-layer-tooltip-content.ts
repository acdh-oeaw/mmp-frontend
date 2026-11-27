import type { Feature } from "geojson";

export function createGeojsonLayerTooltipContent(feature: Feature): string {
	if (feature.properties == null) return "";

	const properties = Object.entries(feature.properties).filter(([key]) => {
		return key !== "Lat" && key !== "Long";
	});

	return `<div class="geo-map-tooltip">
    <ul role="list">
      ${properties
				.map(([key, value]) => {
					return `<li>
          ${key}: ${value}
        </li>`;
				})
				.join("\n")}
    </ul>
  </div>`;
}
