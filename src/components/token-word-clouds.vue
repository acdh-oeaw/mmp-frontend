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
	<div class="absolute inset-0 grid grid-cols-2" data-word-clouds>
		<VisualisationContainer v-slot="{ width, height }" class="rounded">
			<WordCloud :cloud="props.clouds.keywords" :height="height" :width="width" />
		</VisualisationContainer>
		<VisualisationContainer v-slot="{ width, height }" class="rounded">
			<WordCloud :cloud="props.clouds.tokens" :height="height" :width="width" />
		</VisualisationContainer>
	</div>
</template>
