<script lang="ts" setup>
import { runSync } from "@mdx-js/mdx";
import { computed } from "vue";
import * as runtime from "vue-jsx-runtime";

import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import StoryVisualisation from "@/components/story-visualisation.vue";
import { useFetch, useHead, useRoute } from "#imports";

const title = "Story";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const route = useRoute();
const id = computed(() => {
	return Number(route.params["id"]);
});
const response = await useFetch(() => {
	return `/api/story/${id.value}`;
});
const isLoading = computed(() => {
	return response.pending.value;
});
const isError = computed(() => {
	return response.error.value != null;
});

const code = computed(() => {
	if (response.data.value == null) return null;

	return runSync(response.data.value.code, runtime);
});

const components = {
	h1: "h3",
	h2: "h4",
	h3: "h5",
	StoryVisualisation,
};

const StoryContent = code.value?.default;
</script>

<template>
	<div class="relative mx-auto h-full w-full max-w-7xl px-8 py-4">
		<h2 class="sr-only">Story</h2>

		<template v-if="isLoading">
			<LoadingIndicator>Loading story...</LoadingIndicator>
		</template>

		<template v-else-if="isError">
			<ErrorMessage>Failed to load story.</ErrorMessage>
		</template>

		<template v-else-if="code == null">
			<NothingFoundMessage></NothingFoundMessage>
		</template>

		<template v-else>
			<div class="prose max-w-none">
				<StoryContent :components="components" />
			</div>
		</template>
	</div>
</template>
