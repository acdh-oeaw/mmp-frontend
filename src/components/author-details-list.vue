<script lang="ts" setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronRightIcon, ChevronUpIcon } from "@heroicons/vue/24/outline";
import { computed } from "vue";

import { type Author } from "@/api";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import KeywordDisclosure from "@/components/keyword-disclosure.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { createList } from "@/lib/create-list";
import { useAuthorDetails } from "@/lib/details/use-author-details";
import { getAuthorLabel } from "@/lib/get-label";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { NuxtLink } from "#components";

const props = defineProps<{
	id: Author["id"];
}>();

const id = computed(() => {
	return props.id;
});
const { createSearchFilterParams, searchFilters } = useSearchFilters();
const { caseStudies, keywords, passages, isLoading, isFetching, isEmpty, isError } =
	useAuthorDetails(id, searchFilters);
</script>

<template>
	<div class="relative h-full w-full">
		<template v-if="isLoading">
			<Centered>
				<LoadingIndicator>Loading details...</LoadingIndicator>
			</Centered>
		</template>

		<template v-else-if="isError">
			<Centered>
				<ErrorMessage>Failed to load details.</ErrorMessage>
			</Centered>
		</template>

		<template v-else-if="isEmpty">
			<Centered>
				<NothingFoundMessage></NothingFoundMessage>
			</Centered>
		</template>

		<template v-else>
			<template v-if="isFetching">
				<Centered>
					<LoadingIndicator>Updating details...</LoadingIndicator>
				</Centered>
			</template>

			<div class="grid gap-6">
				<KeywordDisclosure :keywords="keywords" />
				<Disclosure
					v-if="caseStudies.length > 0"
					v-slot="{ open }"
					as="section"
					default-open
					class="grid gap-1"
				>
					<DisclosureButton
						as="h3"
						class="cursor-pointer text-left text-sm font-medium uppercase text-neutral-500"
					>
						<div class="flex justify-between rounded p-2 transition hover:bg-black/10">
							<span>Case Studies</span>
							<ChevronUpIcon
								:class="open ? '' : 'rotate-180 transform'"
								class="inline-block h-5 w-5"
							/>
						</div>
					</DisclosureButton>
					<DisclosurePanel as="ul" role="list" class="space-y-4 divide-solid divide-gray-300">
						<li v-for="caseStudy of caseStudies" :key="caseStudy.id">
							<article class="divide-y divide-dotted">
								<div>
									<NuxtLink
										class="flex items-center justify-between rounded p-2 transition hover:bg-black/10"
										:href="{ path: `/case-studies/${caseStudy.id}/timeline` }"
									>
										<strong>
											{{ caseStudy.title }}
										</strong>
										<ChevronRightIcon class="h-5 w-5 shrink-0" />
									</NuxtLink>
								</div>
								<div class="p-2">{{ caseStudy.principal_investigator }}</div>
								<div class="p-2">{{ caseStudy.description }}</div>
							</article>
						</li>
					</DisclosurePanel>
				</Disclosure>
				<Disclosure
					v-if="passages.length > 0"
					v-slot="{ open }"
					as="section"
					default-open
					class="grid gap-1"
				>
					<DisclosureButton
						as="h3"
						class="cursor-pointer text-left text-sm font-medium uppercase text-neutral-500"
					>
						<div class="flex w-full justify-between rounded p-2 transition hover:bg-black/10">
							<span>Passages</span>
							<ChevronUpIcon
								:class="open ? '' : 'rotate-180 transform'"
								class="inline-block h-5 w-5"
							/>
						</div>
					</DisclosureButton>
					<DisclosurePanel as="ul" role="list" class="space-y-4">
						<li v-for="passage of passages" :key="passage.id">
							<article class="divide-y divide-dotted">
								<div
									style="font-style: oblique 7deg"
									class="flex items-center justify-between rounded p-2 pb-1 font-semibold transition hover:bg-black/10"
								>
									<NuxtLink
										class="transition line-clamp-3 hover:text-neutral-700"
										:href="{
											query: createSearchFilterParams({
												...searchFilters,
												passage: [passage.id],
												offset: 0,
											}),
										}"
									>
										{{ passage.zitat }}
									</NuxtLink>
									<ChevronRightIcon class="h-5 w-5 shrink-0" />
								</div>
								<div v-if="passage.text" class="px-2 pt-1 pb-0">
									<div>{{ passage.text.title }}</div>
									<div>{{ createList(passage.text.autor.map(getAuthorLabel)) }}</div>
									<div>Century: {{ passage.text.jahrhundert }}</div>
								</div>
							</article>
						</li>
					</DisclosurePanel>
				</Disclosure>
			</div>
		</template>
	</div>
</template>
