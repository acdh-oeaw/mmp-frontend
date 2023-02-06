<script lang="ts" setup>
import { computed, ref } from 'vue';

import { usePassageKeywords, usePassageNlpData } from '@/api';
import FullscreenButton from '@/components/fullscreen-button.vue';
import PieChart from '@/components/pie-chart.vue';
import WordCloud from '@/components/word-cloud.vue';
import { useWordCloudSearchParams } from '@/lib/search/use-word-cloud-search-params';
import type { Token } from '@/lib/word-cloud/word-cloud.types';

const searchParams = useWordCloudSearchParams();

const passageNlpDataQuery = usePassageNlpData(searchParams);
const passageKeywordsQuery = usePassageKeywords(searchParams);

const isLoading = computed(() => {
	return [passageNlpDataQuery, passageKeywordsQuery].some((query) => {
		return query.isInitialLoading.value;
	});
});

const data = computed(() => {
	const nlpData = passageNlpDataQuery.data.value;
	const keywords = passageKeywordsQuery.data.value;

	if (nlpData == null || keywords == null) {
		return { words: [[], []], filteredWords: [[], []] };
	}

	const allWords = [
		Object.entries(nlpData.token_dict),
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		keywords.token_dict.map((x) => Object.entries(x)[0]!),
	] as [Token[], Token[]];

	function sortWords(a: any, b: any) {
		// sorts after occurences, then alphabetically
		if (a[1] < b[1]) return 1;
		if (a[1] > b[1]) return -1;
		if (a[0] > b[0]) return 1;
		if (a[0] < b[0]) return -1;
		return 0;
	}

	const words = allWords.map((x) => x.sort(sortWords)) as [Token[], Token[]];

	for (let i = 0; i < allWords.length; i += 1) {
		// improves performance by a lot, removing unused and non words
		// @ts-expect-error Add types.
		for (let j = 1; allWords[i].length > 75; j += 1) {
			// @ts-expect-error Add types.
			allWords[i] = allWords[i].filter((entry) => entry[0].match(/\w+/g) && entry[1] > j);
		}
		// removes unecessary tags
		// @ts-expect-error Add types.
		allWords[i] = allWords[i].map((word) => [word[0].split(' (')[0], word[1]]);
	}

	return { words, filteredWords: allWords };
});

const drawer = ref(false);
const speeddial = ref(false);
const check = ref(['words', 'keywords']);
const titles = ['All Words', 'Keywords'];
const type = ref('cloud');

const showWords = computed(() => {
	return [check.value.includes('words'), check.value.includes('keywords')];
});
</script>

<template>
	<VCard width="100%" color="transparent" :height="500">
		<VOverlay
			absolute
			opacity=".2"
			:value="isLoading || !Object.values(data.filteredWords).some((x) => x.length)"
		>
			<h1 v-if="isLoading" class="no-nodes">
				<VProgressCircular indeterminate color="#0F1226" />
			</h1>
			<h1 v-else class="no-nodes">No words found!</h1>
		</VOverlay>

		<VRow v-if="type === 'pie'">
			<template v-for="(filtered, i) in data.filteredWords">
				<VCol
					v-if="showWords[i]"
					:key="JSON.stringify(filtered) + i"
					:cols="showWords.filter((x) => x).length >= 2 ? 6 : 12"
				>
					<PieChart :data="filtered" :title="titles[i]" :height="500" />
				</VCol>
			</template>
		</VRow>
		<VRow v-else>
			<template v-for="(filtered, i) in data.filteredWords">
				<VCol
					v-if="showWords[i]"
					:key="JSON.stringify(filtered) + i"
					:cols="showWords.filter((x) => x).length >= 2 ? 6 : 12"
				>
					<WordCloud :data="filtered" :title="titles[i]" />
				</VCol>
			</template>
		</VRow>

		<VNavigationDrawer v-model="drawer" absolute right>
			<VCard :min-height="498">
				<VBtn absolute top right icon style="z-index: 100" @click="drawer = false">
					<VIcon>mdi-close</VIcon>
				</VBtn>
				<VCardText>
					<VCheckbox v-model="check" label="Show all words" value="words" color="green lighten-1" />
					<VCheckbox
						v-model="check"
						label="Show keywords"
						value="keywords"
						color="blue lighten-2"
					/>
				</VCardText>
				<VContainer>
					<VExpansionPanels flat accordion>
						<VExpansionPanel
							v-for="(title, i) in ['Keyword occurences', 'All occurences']"
							:key="title"
						>
							<VExpansionPanelHeader>
								{{ title }}
								<template #actions>
									<VChip small>{{ data.words[1 - i] ? data.words[1 - i].length : 0 }}</VChip>
									<VIcon> $expand </VIcon>
								</template>
							</VExpansionPanelHeader>
							<VExpansionPanelContent>
								<VList dense>
									<VListItem v-for="entry in data.words[1 - i]" :key="entry[0]">
										<VListItemContent>
											<VListItemTitle>{{ entry[0] }}:&nbsp;{{ entry[1] }}</VListItemTitle>
										</VListItemContent>
									</VListItem>
								</VList>
							</VExpansionPanelContent>
						</VExpansionPanel>
					</VExpansionPanels>
				</VContainer>
				<VCardActions>
					<VBtn text absolute bottom right @click="drawer = false">Close</VBtn>
				</VCardActions>
			</VCard>
		</VNavigationDrawer>

		<VBtn icon absolute top right @click="drawer = true">
			<VIcon>mdi-menu</VIcon>
		</VBtn>

		<FullscreenButton />

		<VSpeedDial
			v-model="speeddial"
			absolute
			top
			left
			direction="bottom"
			transition="slide-y-transition"
		>
			<template #activator>
				<VBtn v-model="speeddial" icon small>
					<VIcon v-if="speeddial">mdi-close</VIcon>
					<VIcon v-else>mdi-dots-vertical</VIcon>
				</VBtn>
			</template>
			<VTooltip right transition="slide-x-transition">
				<template #activator="{ on, attrs }">
					<VBtn fab small v-bind="attrs" @click="type = 'cloud'" v-on="on">
						<VIcon>mdi-cloud</VIcon>
					</VBtn>
				</template>
				<span>Word Cloud</span>
			</VTooltip>
			<VTooltip right transition="slide-x-transition">
				<template #activator="{ on, attrs }">
					<VBtn fab small v-bind="attrs" @click="type = 'pie'" v-on="on">
						<VIcon>mdi-chart-pie</VIcon>
					</VBtn>
				</template>
				<span>Pie Chart</span>
			</VTooltip>
		</VSpeedDial>
	</VCard>
</template>

<style scoped>
.word-cloud {
	min-height: 500px;
	width: 50%;
}

.full-height {
	height: 100vh !important;
}
</style>
