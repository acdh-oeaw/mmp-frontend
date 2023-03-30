<script lang="ts" setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronRightIcon, ChevronUpIcon } from "@heroicons/vue/24/outline";
import { computed } from "vue";

import { type Place } from "@/api";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { useTextDetails } from "@/lib/details/use-text-details";
import { getPassageLabel } from "@/lib/get-label";
import { createResourceKey } from "@/lib/search/resource-key";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useSelection } from "@/lib/search/use-selection";
import { NuxtLink } from "#components";
import { useRoute } from "#imports";

const props = defineProps<{
	id: Place["id"];
}>();

const id = computed(() => {
	return props.id;
});

const route = useRoute();
const { searchFilters } = useSearchFilters();
const { createSelectionParams } = useSelection();

const { passages, caseStudies, isLoading, isFetching, isEmpty, isError } = useTextDetails(
	id,
	searchFilters,
);
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
				<section v-if="passages.length > 0" class="-ml-2 grid gap-1">
					<Disclosure v-slot="{ open }" as="section" default-open class="grid gap-1">
						<DisclosureButton
							as="h3"
							class="cursor-pointer text-left text-sm font-medium uppercase text-neutral-500"
						>
							<div class="flex justify-between rounded p-2 transition hover:bg-black/10">
								<span>Passages</span>
								<ChevronUpIcon
									:class="open ? '' : 'rotate-180 transform'"
									class="inline-block h-5 w-5"
								/>
							</div>
						</DisclosureButton>
						<DisclosurePanel as="ul" role="list" class="space-y-4 divide-solid divide-gray-300">
							<li v-for="passage of passages" :key="passage.id">
								<article class="divide-y divide-dotted">
									<div>
										<NuxtLink
											class="flex items-center justify-between rounded p-2 transition hover:bg-black/10"
											:href="{
												query: {
													...route.query,
													...createSelectionParams({
														selection: [createResourceKey({ kind: 'stelle', id: passage.id })],
													}),
												},
											}"
										>
											<strong>
												{{ getPassageLabel(passage) }}
											</strong>
											<ChevronRightIcon class="h-5 w-5 shrink-0" />
										</NuxtLink>
									</div>
								</article>
							</li>
						</DisclosurePanel>
					</Disclosure>
				</section>

				<section v-if="caseStudies.length > 0" class="-ml-2 grid gap-1">
					<Disclosure v-slot="{ open }" as="section" default-open class="grid gap-1">
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
											target="_blank"
											class="flex items-center justify-between rounded p-2 transition hover:bg-black/10"
											:href="{ path: `/case-studies/${caseStudy.id}/timeline` }"
										>
											<strong>
												{{ caseStudy.title }}
											</strong>
											<ChevronRightIcon class="h-5 w-5 shrink-0" />
										</NuxtLink>
									</div>
									<div class="grid gap-2 p-2">
										<div>{{ caseStudy.principal_investigator }}</div>
										<div class="line-clamp-4">{{ caseStudy.description }}</div>
									</div>
								</article>
							</li>
						</DisclosurePanel>
					</Disclosure>
				</section>
			</div>
		</template>
	</div>
</template>
