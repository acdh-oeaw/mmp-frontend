<script lang="ts" setup>
import { createSearchFilterKey } from '@/lib/search/create-search-filter-key';
import { getResourceColor } from '@/lib/search/get-resource-color';
import { useSearchFilters } from '@/lib/search/use-search-filters';
import { recommendedSearchFilters } from '~/config/search.config';

const { createSearchFilterParams, defaultSearchFilters } = useSearchFilters();
const count = Object.keys(recommendedSearchFilters).length;
</script>

<template>
	<div class="text-center explore-welcome-screen">
		<p>
			<!-- FIXME: this is incorrect - search results are always passages - other entity types are filters  -->
			Search our database for medieval <b>authors</b>, <b>passages</b>, <b>keywords</b> (such as
			names of peoples) or <b>case studies</b>.
		</p>
		<p>
			For instance, try
			<template v-for="(recommended, key, index) of recommendedSearchFilters">
				<span v-if="index !== 0" :key="key + 'separator'">
					<template v-if="index !== 0 && index !== count - 1">,</template>
					<template v-else>or</template>
				</span>
				<VChip
					:key="key"
					class="mx-1"
					:color="getResourceColor(recommended)"
					:to="{
						name: 'explore-search-results',
						query: createSearchFilterParams({
							...defaultSearchFilters,
							[createSearchFilterKey(recommended.kind)]: [recommended.id],
						}),
					}"
				>
					{{ recommended.label }}
				</VChip>
			</template>
		</p>
		<p>
			Use the <b>slider</b> below to adjust and narrow down the <b>historical</b> scope of your
			query.
		</p>
	</div>
</template>

<style scoped>
.explore-welcome-screen {
	height: 500px;
	font-size: 1.4em;
	color: hsl(0deg 0% 40%) !important;
}
</style>
