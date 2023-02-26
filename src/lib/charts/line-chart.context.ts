import { type InjectionKey } from "vue";

import { type LineChartContext } from "@/lib/charts/line-chart.types";

export const key = Symbol() as InjectionKey<LineChartContext>;
