<script lang="ts" setup>
import { computed, ref, watch } from "vue";

import { useTextById } from "@/api";
import TextDetails from "@/components/text-details.vue";
import { useResourceIdParam } from "@/lib/use-resource-id-param";
import { useHead } from "#imports";

const title = ref("Text");

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const id = useResourceIdParam();
const ids = computed(() => {
	return new Set([id.value]);
});

const textByIdQuery = useTextById({ id });

watch(textByIdQuery.data, (text) => {
	if (text?.title != null) {
		title.value = text.title;
	}
});
</script>

<template>
	<div class="relative mx-auto grid h-full w-full">
		<h2 class="sr-only">Text</h2>

		<div>
			<TextDetails :ids="ids" />
		</div>
	</div>
</template>
