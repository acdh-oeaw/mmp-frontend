<script lang="ts" setup>
import { type Keyword, useKeywordById } from "@/api";
import { type NuxtLinkProps } from "#app";
import { NuxtLink } from "#components";

const props = defineProps<{
	href: NuxtLinkProps["href"];
	keyword: Keyword["id"];
}>();

const query = useKeywordById({ id: props.keyword });
const isLoading = query.isLoading;
const keywordData = query.data;
</script>

<template>
	<LoadingIndicator v-if="isLoading"></LoadingIndicator>
	<NuxtLink v-else-if="keywordData != null" :href="href">
		<span
			class="relative inline-flex items-center gap-1 overflow-hidden rounded bg-neutral-200 px-2 py-1 text-xs font-medium transition hover:underline"
		>
			<span class="block truncate">{{ keywordData.stichwort }}</span>
		</span>
	</NuxtLink>
</template>
