<script lang="ts" setup>
import { type KeywordType, type ResourceKind } from "@/api";
import { keywordNodeColors, nodeColors } from "@/lib/network-graph/network-graph.config";
import { keywordTypeLabels, kindLabels } from "@/lib/search/search.config";

const props = defineProps<{
	keywordTypeFilters: Map<KeywordType, boolean>;
	resourceKindFilters: Map<ResourceKind, boolean>;
}>();

const emit = defineEmits<{
	(event: "toggle-keyword-type-filter", filter: KeywordType, isVisible: boolean): void;
	(event: "toggle-resource-kind-filter", filter: ResourceKind, isVisible: boolean): void;
}>();

//

function onToggleKeywordTypeFilter(filter: KeywordType, event: Event) {
	const element = event.currentTarget as HTMLInputElement;
	const isVisible = element.checked;
	emit("toggle-keyword-type-filter", filter, isVisible);
}

function onToggleResourceKindFilter(filter: ResourceKind, event: Event) {
	const element = event.currentTarget as HTMLInputElement;
	const isVisible = element.checked;
	emit("toggle-resource-kind-filter", filter, isVisible);
}
</script>

<template>
	<div class="flex items-center gap-2">
		<form class="flex items-center gap-2 text-xs font-medium" @submit.prevent="">
			<template v-for="[key, isVisible] of props.resourceKindFilters">
				<label v-if="key !== 'keyword'" :key="key" class="flex items-center gap-1">
					<input
						:checked="isVisible"
						type="checkbox"
						:value="key"
						@change="
							(event) => {
								onToggleResourceKindFilter(key, event);
							}
						"
					/>
					<span class="h-3 w-3 rounded" :style="{ background: nodeColors[key] }" />
					<span>{{ kindLabels[key].other }}</span>
				</label>
			</template>
			<!-- TODO: should be a checkbox group -->
			<label
				v-for="[key, isVisible] of props.keywordTypeFilters"
				:key="key"
				class="flex items-center gap-1"
			>
				<input
					:checked="isVisible"
					type="checkbox"
					:value="key"
					@change="
						(event) => {
							onToggleKeywordTypeFilter(key, event);
						}
					"
				/>
				<span class="h-3 w-3 rounded" :style="{ background: keywordNodeColors[key] }" />
				<span>{{ keywordTypeLabels[key].other }}</span>
			</label>
		</form>
	</div>
</template>
