<script lang="ts" setup>
import { ref } from "vue";

import { type Token } from "@/lib/word-cloud/word-cloud.types";

interface WordCloudContext {
	cloud: null;
}

const props = defineProps<{
	cloud: Array<Token>;
	height: number;
	width: number;
}>();

const emit = defineEmits<{
	(event: "ready", cloud: null): void;
}>();

const context: WordCloudContext = {
	cloud: null,
};

const elementRef = ref<HTMLElement | null>(null);

onMounted(() => {
	emit("ready", context.cloud);
});
</script>

<template>
	<div ref="elementRef" class="absolute inset-0 grid" data-word-cloud>
		<slot :context="context" />
	</div>
</template>
