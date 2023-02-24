<script lang="ts" setup>
import { computed } from "vue";

import { type Place } from "@/api";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { usePlaceDetails } from "@/lib/details/use-place-details";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { getAuthorLabel } from "~~/src/lib/get-label";

const props = defineProps<{
	id: Place["id"];
}>();

const id = computed(() => {
	return props.id;
});
const { searchFilters } = useSearchFilters();
const { authors, texts, isLoading, isFetching, isEmpty, isError } = usePlaceDetails(
	id,
	searchFilters,
);
</script>

<template>
	<div>
		<template v-if="isLoading">
			<LoadingIndicator>Loading details...</LoadingIndicator>
		</template>

		<template v-else-if="isError">
			<ErrorMessage>Failed to load details.</ErrorMessage>
		</template>

		<template v-else-if="isEmpty">
			<NothingFoundMessage></NothingFoundMessage>
		</template>

		<template v-else>
			<template v-if="isFetching">
				<LoadingIndicator>Updating details...</LoadingIndicator>
			</template>

			<section v-if="authors.length > 0">
				<h3>Authors</h3>
				<ul role="list">
					<li v-for="author of authors" :key="author.id">
						<article>
							<div>{{ getAuthorLabel(author) }}</div>
							<div v-if="author.kommentar">{{ author.kommentar }}</div>
							<div>{{ author.jahrhundert }}</div>
						</article>
					</li>
				</ul>
			</section>

			<section v-if="texts.length > 0">
				<h3>Case studies</h3>
				<ul role="list">
					<li v-for="text of texts" :key="text.id">
						<article>
							<div>{{ text.title }}</div>
							<div>{{ text.autor.map(getAuthorLabel).join(", ") }}</div>
							<div>{{ text.jahrhundert }}</div>
						</article>
					</li>
				</ul>
			</section>
		</template>
	</div>
</template>
