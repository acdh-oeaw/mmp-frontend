import { maxTokens } from "@/lib/word-cloud/word-cloud.config";
import type { Token } from "@/lib/word-cloud/word-cloud.types";

export function createTokenData(tokens: Record<string, number>): Array<Token> {
	return (
		Object.entries(tokens)
			.map(([token, count]) => {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				return { text: token.split(" (")[0]!, value: count };
			})
			/** Sort by occurence, then alphabetically. */
			.sort((a, z) => {
				if (a.value < z.value) return 1;
				if (a.value > z.value) return -1;
				return a.text.localeCompare(z.text);
			})
			.slice(0, maxTokens)
	);
}
