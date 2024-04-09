<script lang="ts" setup>
import { type KeywordType, type ResourceKind } from "@/api";
import CheckBox from "@/components/checkbox.vue";
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

function onToggleKeywordTypeFilter(filter: KeywordType, isVisible: boolean) {
	emit("toggle-keyword-type-filter", filter, isVisible);
}

function onToggleResourceKindFilter(filter: ResourceKind, isVisible: boolean) {
	emit("toggle-resource-kind-filter", filter, isVisible);
}
</script>

<template>
	<div class="flex items-center gap-2">
		<form class="flex items-center gap-2 text-xs font-medium" @submit.prevent="">
			<template v-for="[key, isVisible] of props.resourceKindFilters">
				<CheckBox
					v-if="key !== 'keyword'"
					:key="key"
					:checked="isVisible"
					:value="key"
					@change="(isVisible) => onToggleResourceKindFilter(key, isVisible)"
				>
					<span class="h-3 w-3 rounded" :style="{ background: nodeColors[key] }" />
					<span>{{ kindLabels[key].other }}</span>
				</CheckBox>
			</template>
			<!-- TODO: should be a checkbox group -->
			<CheckBox
				v-for="[key, isVisible] of props.keywordTypeFilters"
				:key="key"
				:checked="isVisible"
				type="checkbox"
				:value="key"
				@change="(isVisible) => onToggleKeywordTypeFilter(key, isVisible)"
			>
				<span class="h-3 w-3 rounded" :style="{ background: keywordNodeColors[key] }" />
				<span>{{ keywordTypeLabels[key].other }}</span>
			</CheckBox>
		</form>
	</div>
</template>
