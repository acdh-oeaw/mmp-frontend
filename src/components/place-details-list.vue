<script lang="ts" setup>
import { computed } from "vue";

import { type Place } from "@/api";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { createList } from "@/lib/create-list";
import { usePlaceDetails } from "@/lib/details/use-place-details";
import { getAuthorLabel } from "@/lib/get-label";
import { useSearchFilters } from "@/lib/search/use-search-filters";

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
	<div class="relative h-full w-full">
		<template v-if="isLoading">
			<Centered>
				<LoadingIndicator>Loading details...</LoadingIndicator>
			</Centered>
		</template>

		<template v-else-if="isError">
			<Centered>
				<ErrorMessage>Failed to load details.</ErrorMessage>
			</Centered>
		</template>

		<template v-else-if="isEmpty">
			<Centered>
				<NothingFoundMessage></NothingFoundMessage>
			</Centered>
		</template>

		<template v-else>
			<template v-if="isFetching">
				<Centered>
					<LoadingIndicator>Updating details...</LoadingIndicator>
				</Centered>
			</template>

			<div class="grid gap-6">
				<section v-if="authors.length > 0" class="grid gap-1">
					<h3 class="text-xs font-medium uppercase text-neutral-500">Authors</h3>
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

				<section v-if="texts.length > 0" class="grid gap-1">
					<h3 class="text-xs font-medium uppercase text-neutral-500">Case studies</h3>
					<ul role="list">
						<li v-for="text of texts" :key="text.id">
							<article>
								<div>{{ text.title }}</div>
								<div>{{ createList(text.autor.map(getAuthorLabel)) }}</div>
								<div>{{ text.jahrhundert }}</div>
							</article>
						</li>
					</ul>
				</section>
			</div>
		</template>
	</div>
</template>
