<script lang="ts" setup>
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/20/solid";
import { type RouteLocationRaw } from "vue-router";

import { NuxtLink } from "#components";

const props = defineProps<{
	previous: RouteLocationRaw | null;
	next: RouteLocationRaw | null;
	pages: number;
	page: number;
}>();
</script>

<template>
	<nav
		v-if="props.previous != null || props.next != null"
		aria-label="Pagination"
		class="flex items-center justify-center gap-8 p-4 text-sm"
	>
		<NuxtLink
			v-if="props.previous != null"
			class="inline-flex select-none items-center gap-1 transition hover:text-neutral-700"
			:href="props.previous"
			rel="prev"
		>
			<ChevronLeftIcon class="h-5 w-5" />
			<span>Previous page</span>
		</NuxtLink>
		<span
			v-else
			class="inline-flex cursor-not-allowed select-none items-center gap-1 text-neutral-500"
		>
			<ChevronLeftIcon class="h-5 w-5" />
			<span>Previous page</span>
		</span>

		<div>{{ props.page }} of {{ props.pages }} pages</div>

		<NuxtLink
			v-if="props.next != null"
			class="inline-flex select-none items-center gap-1 transition hover:text-neutral-700"
			:href="props.next"
			rel="next"
		>
			<span>Next page</span>
			<ChevronRightIcon class="h-5 w-5" />
		</NuxtLink>
		<span
			v-else
			class="inline-flex cursor-not-allowed select-none items-center gap-1 text-neutral-500"
		>
			<span>Next page</span>
			<ChevronRightIcon class="h-5 w-5" />
		</span>
	</nav>
</template>
