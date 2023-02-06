<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

import { useCaseStudyById } from '@/api';

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
						CASE STUDY<span v-if="caseStudy.principal_investigator">
							&nbsp;&nbsp;&bull;&nbsp;&nbsp;{{ caseStudy.principal_investigator }}
						</span>
					</p>

					<p class="text-h4">{{ caseStudy.title }}</p>
					<p v-if="caseStudy.description">{{ caseStudy.description }}</p>
					<VTabs fixed-tabs show-arrows background-color="transparent">
						<VTab exact :to="{ name: 'case-study-timeline' }">Timeline</VTab>
						<VTab v-if="caseStudy.story_map" exact :to="{ name: 'case-study-story' }">
							Story Map
						</VTab>
						<VTab exact :to="{ name: 'case-study-network-graph' }">Graph</VTab>
						<VTab exact :to="{ name: 'case-study-geo-map' }">Map</VTab>
						<VTab exact :to="{ name: 'case-study-word-cloud' }">Word Cloud</VTab>
						<VTab exact :to="{ name: 'case-study-texts-by-authors' }">Texts & Authors</VTab>
					</VTabs>

					<br />

					<VTabsItems>
						<VTabItem value="timeline">
							<VCard color="transparent">
								<RouterView />
							</VCard>
						</VTabItem>
					</VTabsItems>
				</template>

				<template v-else>
					<VSkeletonLoader type="text@3" />
					<br />
					<VSkeletonLoader type="heading" />
					<br />
					<VSkeletonLoader type="text@50" />
				</template>
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
