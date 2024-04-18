<script lang="ts" setup>
import type { Keyword } from "@/api";
import { keywordColors } from "@/lib/search/search.config";

const props = defineProps<{
	keyword: Pick<Keyword, "art" | "stichwort">;
}>();
</script>

<template>
	<span
		class="relative inline-flex items-center gap-1 overflow-hidden rounded px-2 py-1 text-xs font-medium transition"
		:class="keywordColors[props.keyword.art] ?? 'bg-neutral-200'"
	>
		<span class="block truncate">{{ keyword.stichwort }}</span>
	</span>
</template>
