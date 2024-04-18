import { maxTokens } from "@/lib/word-cloud/word-cloud.config";
import type { Token } from "@/lib/word-cloud/word-cloud.types";

export function createTokenData(tokens: Record<string, number>): Array<Token> {
	return (
		Object.entries(tokens)
			.map(([token, count]) => {
				return { name: token.split(" (")[0]!, weight: count };
			})
			/** Sort by occurence, then alphabetically. */
			.sort((a, z) => {
				if (a.weight < z.weight) return 1;
				if (a.weight > z.weight) return -1;
				return a.name.localeCompare(z.name);
			})
			.slice(0, maxTokens)
	);
}
