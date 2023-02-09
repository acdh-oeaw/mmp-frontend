<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

import { useCaseStudyById } from '@/api';
import LoadingIndicator from '@/components/loading-indicator.vue';
import { isNonEmptyString } from '@/lib/is-nonempty-string';

const route = useRoute();
const id = computed(() => {
	return Number(route.params['id']);
});

const caseStudyQuery = useCaseStudyById({ id });

const isLoading = computed(() => {
	return caseStudyQuery.isInitialLoading.value;
});

const caseStudy = computed(() => {
	return caseStudyQuery.data.value;
});

const tabs = computed(() => {
	const tabs = {
		timeline: { name: 'case-study-timeline', label: 'Timeline' },
		story: { name: 'case-study-story', label: 'Story' },
		'network-graph': { name: 'case-study-network-graph', label: 'Network Graph' },
		'geo-map': { name: 'case-study-geo-map', label: 'Map' },
		'word-cloud': { name: 'case-study-word-cloud', label: 'Word Cloud' },
		authors: { name: 'case-study-texts-by-authors', label: 'Texts by authors' },
	};

	if (!isNonEmptyString(caseStudy.value)) {
		const { story: _, ...rest } = tabs;
		return rest;
	}

	return tabs;
});
</script>

<template>
	<VContainer>
		<VRow justify="center">
			<VCol cols="12" xl="8">
				<template v-if="!isLoading && caseStudy">
					<p class="text-h7 grey--text">
						<VBtn icon plain :to="{ name: 'case-studies' }">
							<VIcon>mdi-chevron-left</VIcon>
						</VBtn>
						CASE STUDY
						<span v-if="caseStudy.principal_investigator">
							<span class="mx-2">&bull;</span>{{ caseStudy.principal_investigator }}
						</span>
					</p>

					<p class="text-h4">{{ caseStudy.title }}</p>
					<p v-if="caseStudy.description">{{ caseStudy.description }}</p>

					<VTabs fixed-tabs show-arrows background-color="transparent">
						<VTab v-for="(tab, key) of tabs" :key="key" exact :to="{ name: tab.name }">
							{{ tab.label }}
						</VTab>
					</VTabs>

					<br />

					<RouterView />
				</template>

				<div v-else class="d-flex justify-center">
					<LoadingIndicator />
				</div>
			</VCol>
		</VRow>
	</VContainer>
</template>

<style>
.v-timeline-item__body {
	height: inherit;
	margin: auto;
}
</style>
