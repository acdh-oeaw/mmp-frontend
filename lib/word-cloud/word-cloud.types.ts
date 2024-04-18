import type { Chart } from "highcharts";

export interface Token {
	name: string;
	weight: number;
}

export interface WordCloudContext {
	cloud: Chart | null;
}
