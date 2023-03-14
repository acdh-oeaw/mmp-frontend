<script lang="ts" setup>
import { computed } from "vue";

import PassageDetails from "@/components/passage-details.vue";
import { useResourceIdParam } from "@/lib/use-resource-id-param";
import { useHead } from "#imports";

const title = "Passage";

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
		<h2 class="sr-only">Passage</h2>

		<div>
			<PassageDetails :ids="ids" />
		</div>
	</div>
</template>
