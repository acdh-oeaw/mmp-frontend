<script lang="ts" setup>
import { computed, ref, watch } from "vue";

import { useAuthorById } from "@/api";
import AuthorDetails from "@/components/author-details.vue";
import { useResourceIdParam } from "@/lib/use-resource-id-param";
import { useHead } from "#imports";

const title = ref("Author");

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const id = useResourceIdParam();
const ids = computed(() => {
	return new Set([id.value]);
});

const authorByIdQuery = useAuthorById({ id });

watch(authorByIdQuery.data, (author) => {
	if (author?.name != null) {
		title.value = author.name;
	}
});
</script>

<template>
	<div class="relative mx-auto grid size-full">
		<h2 class="sr-only">Author</h2>
		<div>
			<AuthorDetails :ids="ids" />
		</div>
	</div>
</template>
