import { type ConeOriginGeojson } from "@/lib/geo-map/geo-map.types";

export function createConeOriginTooltipContent(feature: ConeOriginGeojson): string {
	const label = feature.properties.name;
	const type = feature.properties.art?.label;
	const areas = Array.from(feature.properties.spatialCoverages.values());

	return `<div class="geo-map-tooltip">
    <strong>${label} (${type})</strong>
    <ul role="list">
      ${areas
				.map((feature) => {
					const label = feature.key_word?.stichwort;
					const type = feature.key_word?.art;
					return `<li>
            <span>${label} (${type})</span>
          </li>`;
				})
				.join("\n")}
    </ul>
  </div>`;
}
