<script lang="ts" setup>
import { computed } from "vue";

import TextDetails from "@/components/text-details.vue";
import { useResourceIdParam } from "@/lib/use-resource-id-param";
import { useHead } from "#imports";

const title = "Text";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const id = useResourceIdParam();
const ids = computed(() => {
	return new Set([id.value]);
});
</script>

<template>
	<div class="relative mx-auto h-full w-full">
		<h2 class="sr-only">Text</h2>

		<div>
			<TextDetails :ids="ids" />
		</div>
	</div>
</template>
