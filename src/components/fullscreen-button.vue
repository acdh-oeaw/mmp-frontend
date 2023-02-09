<script lang="ts" setup>
import { computed } from 'vue';

import { useSearchFilters } from '@/lib/search/use-search-filters';
import { useViewMode } from '@/lib/use-view-mode';

const props = defineProps<{
	/** @default 'right' */
	position?: 'left' | 'right';
}>();

const { searchFilters, createSearchFilterParams } = useSearchFilters();
const {
	searchFilters: viewModeSearchFilters,
	createSearchFilterParams: createViewModeSearchFilterParams,
} = useViewMode();

const isFullScreen = computed(() => viewModeSearchFilters.value['view-mode'] === 'fullscreen');
</script>

<template>
	<VBtn
		absolute
		bottom
		depressed
		icon
		:right="props.position !== 'left'"
		:to="{
			query: {
				...createSearchFilterParams(searchFilters),
				...createViewModeSearchFilterParams({
					'view-mode': isFullScreen ? 'normal' : 'fullscreen',
				}),
			},
		}"
	>
		<VIcon v-if="isFullScreen">mdi-fullscreen-exit</VIcon>
		<VIcon v-else>mdi-fullscreen</VIcon>
	</VBtn>
</template>
