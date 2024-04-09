<script lang="ts" setup>
import { computed, ref, watch } from "vue";

import { useKeywordById } from "@/api";
import KeywordDetails from "@/components/keyword-details.vue";
import { useResourceIdParam } from "@/lib/use-resource-id-param";
import { useHead } from "#imports";

const title = ref("Keyword");

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const id = useResourceIdParam();
const ids = computed(() => {
	return new Set([id.value]);
});

const keywordByIdQuery = useKeywordById({ id });

watch(keywordByIdQuery.data, (text) => {
	if (text?.stichwort != null) {
		title.value = text.stichwort;
	}
});
</script>

<template>
	<div class="relative mx-auto grid h-full w-full">
		<h2 class="sr-only">Keyword</h2>

		<div>
			<KeywordDetails :ids="ids" />
		</div>
	</div>
</template>
