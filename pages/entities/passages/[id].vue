<script lang="ts" setup>
import { computed, ref, watch } from "vue";

import { usePassageById } from "@/api";
import PassageDetails from "@/components/passage-details.vue";
import { useResourceIdParam } from "@/lib/use-resource-id-param";
import { useHead } from "#imports";

const title = ref("Passage");

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const id = useResourceIdParam();
const ids = computed(() => {
	return new Set([id.value]);
});

const passageByIdQuery = usePassageById({ id });

watch(passageByIdQuery.data, (passage) => {
	if (passage?.display_label != null) {
		title.value = passage.display_label;
	}
});
</script>

<template>
	<div class="relative mx-auto grid h-full w-full">
		<h2 class="sr-only">Passage</h2>

		<div>
			<PassageDetails :ids="ids" />
		</div>
	</div>
</template>
