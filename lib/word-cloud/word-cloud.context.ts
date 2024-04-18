import type { InjectionKey } from "vue";

import type { WordCloudContext } from "@/lib/word-cloud/word-cloud.types";

export const key = Symbol() as InjectionKey<WordCloudContext>;
