import type { Chart } from "highcharts";

export interface Token {
	name: string;
	weight: number;
}

export interface LineChartContext {
	chart: Chart | null;
}
