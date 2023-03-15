<script lang="ts" setup>
import { computed } from "vue";

import { type Text, useTextById } from "@/api";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
// import TextDetailsList from "@/components/text-details-list.vue";
// import { getPlaceLabel } from "@/lib/get-label";

const props = defineProps<{
	ids: Set<Text["id"]>;
}>();

const id = computed(() => {
	const id = props.ids.values().next().value;
	return id;
});

const textQuery = useTextById({ id });
const isLoading = textQuery.isInitialLoading;
const isFetching = textQuery.isFetching;
const isError = textQuery.isError;
const text = textQuery.data;
const isEmpty = computed(() => {
	return text.value == null;
});
</script>

<template>
	<div class="relative mx-auto h-full w-full max-w-7xl px-6 py-4">
		<template v-if="isLoading">
			<Centered>
				<LoadingIndicator>Loading text...</LoadingIndicator>
			</Centered>
		</template>

		<template v-else-if="isError">
			<Centered>
				<ErrorMessage>Failed to load text.</ErrorMessage>
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
					<LoadingIndicator>Updating text...</LoadingIndicator>
				</Centered>
			</template>

			<div class="grid h-full grid-rows-[auto_auto_1fr] gap-4 p-4 text-neutral-800">
				<h2 class="text-lg font-medium">{{ text?.title }}</h2>

				<!-- <dl v-if="text" class="px-2 text-sm font-medium text-neutral-500">
					<div>
						<dt class="sr-only">Century</dt>
						<dd>{{ text.jahrhundert || "Unknown century" }}</dd>
					</div>
					<div>
						<dt class="sr-only">Place</dt>
						<dd>{{ getPlaceLabel(text.ort) }}</dd>
					</div>
					<div>
						<dt class="sr-only">GND</dt>
						<dd>
							<a class="transition hover:text-neutral-700" :href="text.gnd_id" target="_blank">
								{{ text.gnd_id }}
							</a>
						</dd>
					</div>
				</dl> -->

				<!-- <TextDetailsList :id="id" /> -->
			</div>
		</template>
	</div>
</template>
