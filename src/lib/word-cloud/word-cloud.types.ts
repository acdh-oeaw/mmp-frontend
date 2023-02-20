import type { Word } from "d3-cloud";

export type Token = { text: string; value: number };

export type WordToken = Token & Word;

export interface WordCloudContext {
	cloud: null;
}
