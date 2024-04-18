<script lang="ts" setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from "@headlessui/vue";
import { ChartPieIcon, CloudIcon, ListBulletIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";

import FullscreenButton from "@/components/fullscreen-button.vue";
import Toolbar from "@/components/toolbar.vue";
import ToolbarIconButton from "@/components/toolbar-icon-button.vue";
import type { Token } from "@/lib/word-cloud/word-cloud.types";

const props = defineProps<{
	type: "pie-chart" | "word-cloud";
	clouds?: { tokens: Array<Token>; keywords: Array<Token> };
}>();

const emit = defineEmits<{
	(event: "toggle", type: "pie-chart" | "word-cloud"): void;
}>();

function onSetPieChart() {
	emit("toggle", "pie-chart");
}

function onSetWordCloud() {
	emit("toggle", "word-cloud");
}

const isDialogOpen = ref(false);

function onCloseDialog() {
	isDialogOpen.value = false;
}
</script>

<template>
	<Toolbar>
		<div class="flex items-center gap-2">
			<ToolbarIconButton v-if="clouds" label="View all words" @click="isDialogOpen = true">
				<ListBulletIcon class="size-5 shrink-0" />
			</ToolbarIconButton>
			<ToolbarIconButton
				v-if="props.type === 'pie-chart'"
				label="Display word cloud"
				@click="onSetWordCloud"
			>
				<CloudIcon class="size-5 shrink-0" />
			</ToolbarIconButton>
			<ToolbarIconButton
				v-else-if="props.type === 'word-cloud'"
				label="Display pie chart"
				@click="onSetPieChart"
			>
				<ChartPieIcon class="size-5 shrink-0" />
			</ToolbarIconButton>
		</div>
		<div class="flex items-center gap-2">
			<FullscreenButton />
		</div>

		<TransitionRoot :show="isDialogOpen" as="template">
			<Dialog class="relative z-50" @close="onCloseDialog">
				<TransitionChild
					as="template"
					enter="duration-300 ease-out"
					enter-from="opacity-0"
					enter-to="opacity-100"
					leave="duration-200 ease-in"
					leave-from="opacity-100"
					leave-to="opacity-0"
				>
					<div class="fixed inset-0 bg-black/25" />
				</TransitionChild>

				<div class="fixed inset-0 flex items-center justify-center p-4">
					<TransitionChild
						as="template"
						enter="ease-out duration-300"
						enter-from="opacity-0 scale-95"
						enter-to="opacity-100 scale-100"
						leave="ease-in duration-200"
						leave-from="opacity-100 scale-100"
						leave-to="opacity-0 scale-95"
					>
						<DialogPanel
							class="grid size-full max-w-md gap-4 overflow-hidden rounded bg-white py-8 shadow-xl md:h-2/3"
						>
							<div class="flex items-center justify-between px-8">
								<DialogTitle class="text-lg font-medium">List of keywords</DialogTitle>

								<button class="flex gap-1" @click="onCloseDialog">
									<XMarkIcon
										aria-hidden="true"
										class="size-5 shrink-0 transition hover:text-neutral-700"
									/>
									<span class="sr-only">Close</span>
								</button>
							</div>

							<div class="grid grid-cols-2 gap-4 overflow-y-auto px-8 text-sm">
								<h3 class="font-medium">Keywords</h3>
								<h3 class="text-right font-medium">All words</h3>
								<div
									v-for="(list, i) in [props.clouds?.keywords, props.clouds?.tokens]"
									:key="i"
									:class="i === 1 && 'text-right'"
								>
									<ul role="list">
										<li v-for="word in list" :key="word.name">
											{{ word.name }}: {{ word.weight }}
										</li>
									</ul>
								</div>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</Dialog>
		</TransitionRoot>
	</Toolbar>
</template>
