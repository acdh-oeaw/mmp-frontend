import { type InjectionKey } from "vue";

import { type PieChartContext } from "@/lib/word-cloud/pie-chart.types";

export const key = Symbol() as InjectionKey<PieChartContext>;
