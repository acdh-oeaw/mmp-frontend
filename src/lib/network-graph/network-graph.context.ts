import { type InjectionKey } from "vue";

import { type NetworkGraphContext } from "@/lib/network-graph/network-graph.types";

export const key = Symbol() as InjectionKey<NetworkGraphContext>;
