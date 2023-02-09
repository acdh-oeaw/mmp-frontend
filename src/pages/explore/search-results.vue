<script lang="ts" setup>
import { computed, ref } from 'vue';

import { type KeywordType, usePassages } from '@/api';
import FullscreenButton from '@/components/fullscreen-button.vue';
import { getAuthorLabel, getDateRangeLabel } from '@/lib/get-label';
import { keywordColors } from '@/lib/search/search.config';
import { useDetailsSearchFilters } from '@/lib/search/use-details-search-filters';
import { usePassagesSearchParams } from '@/lib/search/use-passages-search-params';
import { useSearchFilters } from '@/lib/search/use-search-filters';
import { useViewMode } from '@/lib/use-view-mode';

const headers = [
	{ text: 'Author', value: 'text.autor', width: '150px' },
	{ text: 'Title', value: 'text.title' },
	{ text: 'Passage', value: 'display_label' },
	{ text: 'Keywords', value: 'keywords' },
	{ text: 'Time Frame', value: 'written', width: '100px' },
	{ text: 'Coverage', value: 'coverage', width: '100px' },
];

// TODO: limit/offset should be read from search params
const limit = ref(10);
const offset = ref(0);
const { createSearchFilterParams, searchFilters } = useSearchFilters();
const {
	createSearchFilterParams: createViewModeSearchFilterParams,
	searchFilters: viewModeSearchFilters,
} = useViewMode();
const searchParams = usePassagesSearchParams();
const passagesQuery = usePassages(
	computed(() => {
		return { ...searchParams.value, limit: limit.value, offset: offset.value };
	})
);
const { createSearchFilterParams: createDetailsSearchFilterParams } = useDetailsSearchFilters();

const _isLoading = computed(() => {
	return passagesQuery.isInitialLoading.value;
});
const isFetching = computed(() => {
	return passagesQuery.isFetching.value;
});

const items = computed(() => {
	return passagesQuery.data.value?.results ?? [];
});

const count = computed(() => {
	return passagesQuery.data.value?.count ?? 0;
});

function onUpdateLimit(value: number) {
	limit.value = value;
}

function onUpdatePage(value: number) {
	offset.value = (value - 1) * limit.value;
}

function getColor(type: KeywordType) {
	return keywordColors[type];
}
</script>

<template>
	<VCard color="transparent" width="100%" flat>
		<VDataTable
			:items="items"
			:headers="headers"
			:loading="isFetching"
			:server-items-length="count"
			disable-sort
			disable-filtering
			no-data-text="No passages found"
			:footer-props="{
				'items-per-page-options': [10, 20, 50, 100, 1000, -1],
			}"
			class="data-table"
			@update:page="onUpdatePage"
			@update:items-per-page="onUpdateLimit"
		>
			<template #[`item.text.autor`]="{ item }">
				<template v-if="item.text">
					<VListItem
						v-for="author of item.text.autor"
						:key="author.id"
						:to="{
							query: {
								...createViewModeSearchFilterParams(viewModeSearchFilters),
								...createSearchFilterParams(searchFilters),
								...createDetailsSearchFilterParams({
									'detail-kind': 'author',
									'detail-id': [author.id],
								}),
							},
						}"
						class="text-decoration-none"
					>
						<VListItemTitle>
							{{ getAuthorLabel(author) }}
						</VListItemTitle>
						<VListItemIcon>
							<VIcon>mdi-chevron-right</VIcon>
						</VListItemIcon>
					</VListItem>
				</template>
			</template>
			<template #[`item.text.title`]="{ item }">
				<template v-if="item.text">
					<VListItem
						:to="{
							params: { id: item.id },
							query: {
								...createViewModeSearchFilterParams(viewModeSearchFilters),
								...createSearchFilterParams(searchFilters),
								...createDetailsSearchFilterParams({
									'detail-kind': 'passage',
									'detail-id': [item.id],
								}),
							},
						}"
						class="text-decoration-none"
					>
						<VListItemTitle>
							<b class="text-title">{{ item.text.title }}</b>
						</VListItemTitle>
						<VListItemIcon>
							<VIcon>mdi-chevron-right</VIcon>
						</VListItemIcon>
					</VListItem>
				</template>
			</template>
			<template #[`item.display_label`]="{ item }">
				<span>
					{{ item.display_label.replace(item.text.title, '').replace(/ \(\d+ - \d+\), /, '') }}
				</span>
			</template>
			<template #[`item.keywords`]="{ item }">
				<div v-for="keyword of item.key_word" :key="keyword.stichwort" class="keyword-chip">
					<VChip
						small
						:color="getColor(keyword.art)"
						:to="{
							query: createSearchFilterParams({
								...searchFilters,
								keyword: [...searchFilters.keyword, keyword.id],
							}),
						}"
					>
						{{ keyword.stichwort }}
					</VChip>
				</div>
			</template>
			<template #[`item.written`]="{ item }">
				{{ item.text ? getDateRangeLabel(item.text.start_date, item.text.end_date) : 'Unknown' }}
			</template>
			<template #[`item.coverage`]="{ item }">
				{{ getDateRangeLabel(item.start_date, item.end_date) }}
			</template>
			<template #[`footer.prepend`]>
				<FullscreenButton position="left" />
			</template>
		</VDataTable>

		<RouterView />
	</VCard>
</template>

<style>
a:hover {
	text-decoration: underline;
}

div.v-data-table.data-table {
	background-color: transparent;
}

.keyword-chip {
	display: inline-block;
	margin: 1.5px;
}

.text-title {
	white-space: normal;
}
</style>
