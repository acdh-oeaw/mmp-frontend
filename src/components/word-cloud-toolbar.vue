<script lang="ts" setup>
import { ChartPieIcon, CloudIcon } from "@heroicons/vue/24/outline";

import Toolbar from "@/components/toolbar.vue";
import ToolbarIconButton from "@/components/toolbar-icon-button.vue";

const props = defineProps<{
	type: "pie-chart" | "word-cloud";
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
</script>

<template>
	<Toolbar>
		<div class="flex items-center gap-2">
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
	</Toolbar>
</template>
