<script lang="ts" setup>
import { runSync } from "@mdx-js/mdx";
import { computed, ref, watch } from "vue";
import * as runtime from "vue-jsx-runtime";

import { useCaseStudyById } from "@/api";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import StoryVisualisation from "@/components/story-visualisation.vue";
import { useResourceIdParam } from "@/lib/use-resource-id-param";
import { useFetch, useHead } from "#imports";

const title = ref("Story");

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const id = useResourceIdParam();
const caseStudyQuery = useCaseStudyById({ id });

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

watch(caseStudyQuery.data, (caseStudy) => {
	if (caseStudy?.title != null) {
		title.value = ["Story", caseStudy.title].join(" - ");
	}
});
</script>

<template>
	<div class="relative mx-auto size-full max-w-7xl px-8 py-4">
		<h2 class="sr-only">Story</h2>

		<template v-if="isLoading">
			<Centered>
				<LoadingIndicator>Loading story...</LoadingIndicator>
			</Centered>
		</template>

		<template v-else-if="isError">
			<Centered>
				<ErrorMessage>Failed to load story.</ErrorMessage>
			</Centered>
		</template>

		<template v-else-if="code == null">
			<Centered>
				<NothingFoundMessage></NothingFoundMessage>
			</Centered>
		</template>

		<template v-else>
			<div class="prose max-w-none py-8">
				<StoryContent :components="components" />
			</div>
		</template>
	</div>
</template>
