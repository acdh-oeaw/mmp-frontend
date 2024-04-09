import { type Chart } from "highcharts";

export type Token = { name: string; weight: number };

export interface LineChartContext {
	chart: Chart | null;
}
