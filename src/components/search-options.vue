<script lang="ts" setup>
import { useDetailsSearchFilters } from '@/lib/search/use-details-search-filters';
import type { DataSet, QueryMode } from '@/lib/search/use-search-filters';
import { dataSets, queryModes, useSearchFilters } from '@/lib/search/use-search-filters';

const { searchFilters, setSearchFilters } = useSearchFilters();
const { searchFilters: detailSearchFilters } = useDetailsSearchFilters();

const dataSetLabels: Record<DataSet, string> = {
	'case-studies': 'Related to case studies',
	gens: 'Related to GENS database',
	all: 'Include everything',
};

const queryModeLabels: Record<QueryMode, { label: string; description: string }> = {
	intersection: { label: 'Intersection', description: 'Show results which contain all inputs' },
	union: { label: 'Union', description: 'Show all results for all inputs' },
};

function onChangeDataset(dataSet: DataSet) {
	setSearchFilters({
		...detailSearchFilters.value,
		...searchFilters.value,
		dataset: dataSet,
	});
}

function onChangeQueryMode(queryMode: QueryMode) {
	setSearchFilters({
		...detailSearchFilters.value,
		...searchFilters.value,
		'query-mode': queryMode,
	});
}
</script>

<template>
	<VCard class="search-options-card">
		<VCardTitle>Search Options</VCardTitle>
		<VCardSubtitle>Change your preferred filters</VCardSubtitle>

		<VCardText>
			<form novalidate @submit.prevent="">
				<VRadioGroup
					:value="searchFilters['dataset']"
					label="Include Data:"
					@change="onChangeDataset"
				>
					<VRadio
						v-for="dataSet of dataSets"
						:key="dataSet"
						:label="dataSetLabels[dataSet]"
						color="teal lighten-2"
						:value="dataSet"
					/>
				</VRadioGroup>

				<VDivider />

				<VRadioGroup :value="searchFilters['query-mode']" @change="onChangeQueryMode">
					<template #label>
						When using multiple entries, use:
						<VTooltip right transition="scroll-x-transition">
							<template #activator="{ on, attrs }">
								<VIcon small v-bind="attrs" v-on="on">mdi-help-circle-outline</VIcon>
							</template>
							<!-- FIXME: which ones? -->
							Note: this only works for certain entities
						</VTooltip>
					</template>
					<VRadio
						v-for="queryMode of queryModes"
						:key="queryMode"
						color="teal lighten-2"
						:value="queryMode"
					>
						<template #label>
							<div>
								<div class="theme--light v-label">{{ queryModeLabels[queryMode].label }}</div>
								<div class="font-weight-regular caption">
									{{ queryModeLabels[queryMode].description }}
								</div>
							</div>
						</template>
					</VRadio>
				</VRadioGroup>
			</form>
		</VCardText>
	</VCard>
</template>

<style scoped>
.search-options-card {
	max-height: 50vh;
	overflow-y: scroll;
}
</style>
