<script lang="ts" setup>
import { useQueries } from '@tanstack/vue-query';
import { computed } from 'vue';

import { createKey } from '@/api';
import * as api from '@/api/client';
import LoadingIndicator from '@/components/loading-indicator.vue';
import { getDateRangeLabel } from '@/lib/get-label';
import { isNotNullable } from '@/lib/is-not-nullable';
import { useDetailsSearchFilters } from '@/lib/search/use-details-search-filters';
import { useSearchFilters } from '@/lib/search/use-search-filters';

const { createSearchFilterParams, searchFilters } = useSearchFilters();
const { searchFilters: detailSearchFilters } = useDetailsSearchFilters();
const ids = computed(() => {
	if (detailSearchFilters.value['detail-kind'] !== 'spatial-coverage') return [];
	return detailSearchFilters.value['detail-id'];
});

const spatialCoverageQueries = useQueries({
	queries: computed(() => {
		return ids.value.map((id) => {
			return {
				queryKey: createKey('geojson-spatial-coverage', 'by-id', { id }),
				queryFn: () => {
					return api.getSpatialCoverageGeojsonById({ id });
				},
			};
		});
	}),
});

const isLoading = computed(() => {
	return spatialCoverageQueries.value.some((query) => {
		return query.isInitialLoading;
	});
});

const spatialCoverages = computed(() => {
	return spatialCoverageQueries.value
		.map((query) => {
			return query.data;
		})
		.filter(isNotNullable);
});
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
			<VListItemContent>Spatial coverages</VListItemContent>
		</VListItem>

		<VDivider />

		<template v-if="!isLoading">
			<VList v-for="d in spatialCoverages" :key="d.id">
				<VListItem>
					<VListItemContent>
						<VListItemTitle v-if="d.properties.key_word?.stichwort" class="text-h5">
							Keyword: {{ d.properties.key_word.stichwort }}
						</VListItemTitle>
						<VListItemSubtitle v-if="d.properties.key_word?.art">
							{{ d.properties.key_word.art }}
						</VListItemSubtitle>
					</VListItemContent>
				</VListItem>
				<VSubheader hide-details>Texts</VSubheader>
				<VListItem v-for="text in d.properties.texts" :key="text.id">
					<VList>
						<VListItemContent>
							<VListItemTitle>{{ text.title }}</VListItemTitle>
							<VListItemSubtitle v-if="text.authors.length">
								{{ text.authors.map((author) => author.name).join(', ') }}
							</VListItemSubtitle>
							<VListItemSubtitle v-if="text.places.length"> </VListItemSubtitle>
						</VListItemContent>
					</VList>
				</VListItem>
				<VSubheader>Passages</VSubheader>
				<VListItem
					v-for="passage in d.properties.stelle"
					:key="passage.id"
					:to="{
						query: createSearchFilterParams({ ...searchFilters, passage: [passage.id] }),
						params: { id: passage.id },
					}"
				>
					<VListItemContent>
						<VListItemTitle>
							{{ passage.display_label }}
						</VListItemTitle>
						<VListItemSubtitle v-if="passage.start_date || passage.end_date">
							{{ getDateRangeLabel(passage.start_date, passage.end_date) }}
						</VListItemSubtitle>
					</VListItemContent>
					<VListItemIcon>
						<VIcon>mdi-chevron-right</VIcon>
					</VListItemIcon>
				</VListItem>
				<VDivider />
			</VList>
		</template>

		<template v-else>
			<VListItem>
				<VListItemContent>
					<VListItemTitle>
						<LoadingIndicator />
					</VListItemTitle>
				</VListItemContent>
			</VListItem>
		</template>
	</div>
</template>
