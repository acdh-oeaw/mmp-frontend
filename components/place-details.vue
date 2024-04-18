<script lang="ts" setup>
import { computed } from "vue";

import { type Place, usePlaceById } from "@/api";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import PlaceDetailsList from "@/components/place-details-list.vue";
import PlaceMap from "@/components/place-map.vue";
import VisualisationContainer from "@/components/visualisation-container.vue";
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
	<div class="relative mx-auto size-full max-w-7xl px-8 py-4">
		<template v-if="isLoading">
			<Centered>
				<LoadingIndicator>Loading place...</LoadingIndicator>
			</Centered>
		</template>

		<template v-else-if="isError">
			<Centered>
				<ErrorMessage>Failed to load place.</ErrorMessage>
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
					<LoadingIndicator>Updating place...</LoadingIndicator>
				</Centered>
			</template>

			<div class="grid h-full grid-rows-[auto_auto_auto_1fr] gap-4 p-4 text-neutral-800">
				<h2 class="text-lg font-medium">{{ getPlaceLabel(place) }}</h2>

				<dl v-if="place" class="text-sm font-medium text-neutral-500">
					<div>
						<dt class="sr-only">Ancient name</dt>
						<dd>{{ place.name_antik }}</dd>
					</div>
					<div>
						<dt class="sr-only">Coordinates</dt>
						<dd>{{ [place.lat, place.long].join(", ") }}</dd>
					</div>
				</dl>

				<div class="grid h-96 w-full">
					<VisualisationContainer v-slot="{ width, height }">
						<PlaceMap
							v-if="place && place.lat && place.long"
							:height="height"
							:points="[{ lat: place.lat, lng: place.long, label: getPlaceLabel(place) }]"
							:width="width"
						/>
					</VisualisationContainer>
				</div>

				<p v-if="place?.kommentar">{{ place.kommentar }}</p>

				<PlaceDetailsList :id="id" />
			</div>
		</template>
	</div>
</template>
