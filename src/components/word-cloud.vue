<script lang="ts" setup>
import { onMounted, onUnmounted, provide, ref } from "vue";

import { key } from "@/lib/word-cloud/word-cloud.context";
import { type Token, type WordCloudContext } from "@/lib/word-cloud/word-cloud.types";

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

onUnmounted(() => {
	//
});

provide(key, context);
</script>

<template>
	<div ref="elementRef" class="absolute inset-0 grid" data-word-cloud />
	<slot :context="context" />
</template>
