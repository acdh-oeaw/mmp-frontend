<script lang="ts" setup>
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { ChartPieIcon, CloudIcon, ListBulletIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";

import Toolbar from "@/components/toolbar.vue";
import ToolbarIconButton from "@/components/toolbar-icon-button.vue";
import { type Token } from "@/lib/word-cloud/word-cloud.types";

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

var isOpen = ref(false);
</script>

<template>
	<Toolbar>
		<div class="flex items-center gap-2"></div>
		<div class="mx-auto flex items-center gap-2"></div>
		<div class="flex items-center gap-2">
			<ToolbarIconButton v-if="clouds" label="View all words" @click="isOpen = true">
				<ListBulletIcon class="h-5 w-5 shrink-0" />
			</ToolbarIconButton>
			<ToolbarIconButton
				v-if="props.type === 'pie-chart'"
				label="Display word cloud"
				@click="onSetWordCloud"
			>
				<CloudIcon class="h-5 w-5 shrink-0" />
			</ToolbarIconButton>
			<ToolbarIconButton
				v-else-if="props.type === 'word-cloud'"
				label="Display pie chart"
				@click="onSetPieChart"
			>
				<ChartPieIcon class="h-5 w-5 shrink-0" />
			</ToolbarIconButton>
		</div>
		<div class="flex items-center gap-2"></div>
		<Dialog :open="isOpen" @close="isOpen = false">
			<div class="fixed inset-0 bg-black/30" aria-hidden="true" @click="isOpen = false" />
			<div class="fixed inset-0 flex items-center justify-center p-4">
				<DialogPanel class="h-2/4 w-fit overflow-y-scroll rounded bg-white p-5">
					<div class="flex justify-between pb-5 align-middle">
						<DialogTitle>List of keywords</DialogTitle>
						<button @click="isOpen = false">
							<XMarkIcon class="h-5 w-5" />
						</button>
					</div>
					<div class="grid grid-cols-2">
						<h2>Keywords</h2>
						<h2 class="pb-2 text-right">All words</h2>
						<div
							v-for="(list, i) in [props.clouds?.keywords, props.clouds?.tokens]"
							:key="String(list)"
							:class="i === 1 && 'text-right'"
						>
							<ul>
								<li v-for="word in list" :key="word.name">{{ word.name }}: {{ word.weight }}</li>
							</ul>
						</div>
					</div>
				</DialogPanel>
			</div>
		</Dialog>
	</Toolbar>
</template>
