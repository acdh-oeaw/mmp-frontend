<script lang="ts" setup>
import { computed, ref, watch } from "vue";

import { usePlaceById } from "@/api";
import PlaceDetails from "@/components/place-details.vue";
import { useResourceIdParam } from "@/lib/use-resource-id-param";
import { useHead } from "#imports";

const title = ref("Place");

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const id = useResourceIdParam();
const ids = computed(() => {
	return new Set([id.value]);
});

const placeByIdQuery = usePlaceById({ id });

watch(placeByIdQuery.data, (place) => {
	if (place?.name != null) {
		title.value = place.name;
	}
});
</script>

<template>
	<div class="relative mx-auto grid h-full w-full">
		<h2 class="sr-only">Place</h2>

		<div>
			<PlaceDetails :ids="ids" />
		</div>
	</div>
</template>
