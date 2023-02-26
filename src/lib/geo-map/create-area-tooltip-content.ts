import { type ConeGeojson, type SpatialCoverageGeojson } from "@/api";
import { getPassageLabel } from "@/lib/get-label";

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
          <span>${getPassageLabel(passage)}</span>
        </li>`;
				})
				.join("\n")}
    </ul>
  </div>`;
}
