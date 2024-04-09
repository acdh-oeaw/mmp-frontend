import { type InjectionKey } from "vue";

import { type GeoMapContext } from "@/lib/geo-map/geo-map.types";

export const key = Symbol() as InjectionKey<GeoMapContext>;
