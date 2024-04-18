import type { InjectionKey } from "vue";

import type { PlaceMapContext } from "@/lib/geo-map/place-map.types";

export const key = Symbol() as InjectionKey<PlaceMapContext>;
