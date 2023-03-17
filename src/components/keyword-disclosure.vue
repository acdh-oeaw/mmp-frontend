<script lang="ts" setup>
import { Disclosure, DisclosureButton } from "@headlessui/vue";
import { ChevronUpIcon } from "@heroicons/vue/24/outline";
import { computed } from "vue";

import { type GetPassageById, type Keyword, type KeywordNormalized } from "@/api";
import KeywordTag from "@/components/keyword-tag.vue";
import { useSearchFilters } from "@/lib/search/use-search-filters";

const props = defineProps<{
	keywords: Array<Keyword> | Array<KeywordNormalized> | GetPassageById.Response["key_word"];
	noHeader?: boolean;
	newTab?: boolean;
}>();
const keywords = computed(() => {
	return props.keywords;
});
const { createSearchFilterParams, searchFilters } = useSearchFilters();
</script>

<template>
	<Disclosure
		v-if="keywords.length > 0"
		v-slot="{ open }"
		as="section"
		class="flex flex-1 flex-col"
	>
		<DisclosureButton
			v-if="!props.noHeader"
			class="text-left text-sm font-medium uppercase text-neutral-500"
		>
			<div
				:class="{
					'hover:bg-black/10': keywords.length > 15,
					'cursor-default': keywords.length <= 15,
				}"
				class="flex w-full justify-between rounded p-2 transition"
			>
				<span>Keywords</span>
				<ChevronUpIcon
					v-if="keywords.length > 15"
					:class="open ? '' : 'rotate-180 transform'"
					class="inline-block h-5 w-5"
				/>
			</div>
		</DisclosureButton>
		<ul class="flex flex-wrap gap-0.5 px-2" role="list">
			<li v-for="keyword of open ? keywords : keywords.slice(0, 15)" :key="keyword.id">
				<NuxtLink
					class="hover:bg-black/10"
					:target="newTab ? '_blank' : undefined"
					:href="{
						path: '/explore/search-results',
						query: createSearchFilterParams({ ...searchFilters, keyword: [keyword.id], offset: 0 }),
					}"
				>
					<KeywordTag :keyword="keyword" />
				</NuxtLink>
			</li>
			<DisclosureButton v-if="!open && keywords.length > 15" as="li">
				<span
					class="relative inline-flex cursor-pointer items-center gap-1 overflow-hidden rounded bg-gray-200 px-2 py-1 text-xs font-medium transition"
				>
					<span class="block">show more...</span>
				</span>
			</DisclosureButton>
		</ul>
	</Disclosure>
</template>
