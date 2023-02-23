<script lang="ts" setup>
import { computed } from "vue";

import { type Place, usePlaceById } from "@/api";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { getPlaceLabel } from "@/lib/get-label";

const props = defineProps<{
	ids: Set<Place["id"]>;
}>();

const id = computed(() => {
	const id = props.ids.values().next().value;
	return id;
});

const placeQuery = usePlaceById({ id });
const isLoading = placeQuery.isInitialLoading;
const isFetching = placeQuery.isFetching;
const isError = placeQuery.isError;
const place = placeQuery.data;
const isEmpty = computed(() => {
	return place.value == null;
});
</script>

<template>
	<div class="relative mx-auto h-full w-full max-w-7xl px-8 py-4">
		<template v-if="isLoading">
			<LoadingIndicator>Loading place...</LoadingIndicator>
		</template>

		<template v-else-if="isError">
			<ErrorMessage>Failed to load place.</ErrorMessage>
		</template>

		<template v-else-if="isEmpty">
			<NothingFoundMessage></NothingFoundMessage>
		</template>

		<template v-else>
			<template v-if="isFetching">
				<LoadingIndicator>Updating place...</LoadingIndicator>
			</template>

			<h2>{{ getPlaceLabel(place) }}</h2>

			<pre>{{ place }}</pre>
		</template>
	</div>
</template>
