<script lang="ts" setup>
import { assert } from '@stefanprobst/assert';
import { computed } from 'vue';

import { useAuthors, usePlaceById, useTexts } from '@/api';
import GeoMapPlace from '@/components/geo-map-place.vue';
import LoadingIndicator from '@/components/loading-indicator.vue';
import { getAuthorLabel, getPlaceLabel } from '@/lib/get-label';
import { useDetailsSearchFilters } from '@/lib/search/use-details-search-filters';
import { useSearchFilters } from '@/lib/search/use-search-filters';

const { searchFilters: detailSearchFilters } = useDetailsSearchFilters();
const id = computed(() => {
	assert(detailSearchFilters.value['detail-kind'] === 'place');
	const id = detailSearchFilters.value['detail-id'][0];
	assert(id != null);
	return id;
});
const { createSearchFilterParams, searchFilters } = useSearchFilters();

const placeQuery = usePlaceById({ id });
const textsQuery = useTexts(
	computed(() => {
		return {
			ort: [id.value],
			has_usecase: searchFilters.value['query-mode'] === 'intersection',
		};
	})
);
const authorsQuery = useAuthors(
	computed(() => {
		return {
			ort: [id.value],
			has_usecase: searchFilters.value['query-mode'] === 'intersection',
		};
	})
);

const isLoading = computed(() => {
	return [placeQuery, textsQuery, authorsQuery].some((query) => query.isInitialLoading.value);
});

const place = computed(() => placeQuery.data.value);
const texts = computed(() => textsQuery.data.value?.results ?? []);
const authors = computed(() => authorsQuery.data.value?.results ?? []);

const textCount = computed(() => textsQuery.data.value?.count);
const authorCount = computed(() => authorsQuery.data.value?.count);
</script>

<template>
	<div>
		<VListItem>
			<VListItemAction>
				<RouterLink
					aria-label="Close panel"
					:to="{ query: createSearchFilterParams(searchFilters) }"
				>
					<VIcon>mdi-close</VIcon>
				</RouterLink>
			</VListItemAction>
			<VListItemContent>
				<template v-if="!isLoading && place">
					<VListItemTitle class="text-h5">
						{{ getPlaceLabel(place) }}
					</VListItemTitle>
					<VListItemSubtitle v-if="place.name_antik">
						{{ place.name_antik }}
					</VListItemSubtitle>
					<VListItemSubtitle>{{ place.lat }}, {{ place.long }}</VListItemSubtitle>
				</template>

				<LoadingIndicator v-else />
			</VListItemContent>
		</VListItem>

		<VDivider />

		<VContainer>
			<div :style="{ height: '400px' }">
				<GeoMapPlace
					v-if="place?.lat != null && place?.long != null"
					:points="[{ lat: place.lat, lng: place.long }]"
				/>
			</div>
		</VContainer>

		<VContainer>
			<VExpansionPanels v-if="!isLoading" flat accordion multiple :value="[0, 1]">
				<VExpansionPanel :disabled="!authorCount">
					<VExpansionPanelHeader>
						<template #actions>
							<VChip small color="red lighten-3" :disabled="!authorCount">
								{{ authorCount }}
							</VChip>
							<VIcon>mdi-chevron-down</VIcon>
						</template>
						Authors
					</VExpansionPanelHeader>
					<VExpansionPanelContent>
						<VListItem
							v-for="author in authors"
							:key="author.id"
							:to="{
								query: createSearchFilterParams({ ...searchFilters, author: [author.id] }),
								params: { id: author.id },
							}"
						>
							<VListItemContent>
								<VListItemTitle>{{ getAuthorLabel(author) }}</VListItemTitle>
								<VListItemSubtitle v-if="author.kommentar">
									{{ author.kommentar }}
								</VListItemSubtitle>
								<VListItemSubtitle>{{ author.jahrhundert }}</VListItemSubtitle>
							</VListItemContent>
							<VListItemIcon>
								<VIcon>mdi-chevron-right</VIcon>
							</VListItemIcon>
						</VListItem>
					</VExpansionPanelContent>
				</VExpansionPanel>
				<VExpansionPanel :disabled="!textCount">
					<VExpansionPanelHeader>
						<template #actions>
							<VChip small color="red darken-3" dark :disabled="!textCount">
								{{ textCount }}
							</VChip>
							<VIcon>mdi-chevron-down</VIcon>
						</template>
						Texts
					</VExpansionPanelHeader>
					<VExpansionPanelContent>
						<VListItem v-for="text in texts" :key="text.id" two-line>
							<VListItemContent>
								<VListItemTitle>{{ text.title }}</VListItemTitle>
								<VListItemSubtitle>
									{{ text.autor.map(getAuthorLabel).join(', ') }}
								</VListItemSubtitle>
								<VListItemSubtitle>{{ text.jahrhundert }}</VListItemSubtitle>
							</VListItemContent>
						</VListItem>
					</VExpansionPanelContent>
				</VExpansionPanel>
			</VExpansionPanels>

			<LoadingIndicator v-else />
		</VContainer>
	</div>
</template>
