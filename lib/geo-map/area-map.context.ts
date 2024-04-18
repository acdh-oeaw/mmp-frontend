import type { InjectionKey } from "vue";

import type { AreaMapContext } from "@/lib/geo-map/area-map.types";

export const key = Symbol() as InjectionKey<AreaMapContext>;
