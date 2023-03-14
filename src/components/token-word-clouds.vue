<script lang="ts" setup>
import VisualisationContainer from "@/components/visualisation-container.vue";
import WordCloud from "@/components/word-cloud.vue";
import { type Token } from "@/lib/word-cloud/word-cloud.types";

const props = defineProps<{
	clouds: { tokens: Array<Token>; keywords: Array<Token> };
	height: number;
	width: number;
}>();
</script>

<template>
	<div class="absolute inset-0 grid grid-cols-2 gap-8 px-8 py-12" data-word-clouds>
		<div class="grid h-full w-full grid-rows-[auto_1fr]">
			<span class="mt-8 text-center font-medium">Keywords</span>
			<VisualisationContainer v-slot="{ width, height }" class="rounded">
				<WordCloud :cloud="props.clouds.keywords" :height="height" :width="width" />
			</VisualisationContainer>
		</div>
		<div class="grid h-full w-full grid-rows-[auto_1fr]">
			<span class="mt-8 text-center font-medium">All words</span>
			<VisualisationContainer v-slot="{ width, height }" class="rounded">
				<WordCloud :cloud="props.clouds.tokens" :height="height" :width="width" />
			</VisualisationContainer>
		</div>
	</div>
</template>
