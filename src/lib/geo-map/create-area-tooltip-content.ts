import { type ConeGeojson, type SpatialCoverageGeojson } from "@/api";

export function createAreaTooltipContent(feature: ConeGeojson | SpatialCoverageGeojson): string {
	const label = feature.properties.key_word?.stichwort;
	const type = feature.properties.key_word?.art;
	const passages = feature.properties.stelle;

	return `<div class="geo-map-tooltip">
    <strong>${label} (${type})</strong>
    <ul role="list">
      ${passages
				.map((passage) => {
					return `<li>
          <span>${passage.display_label}</span>
        </li>`;
				})
				.join("\n")}
    </ul>
  </div>`;
}
