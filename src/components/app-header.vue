<script lang="ts" setup>
import { Bars3Icon as MenuIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";

import { NuxtLink } from "#components";

const links = {
	explore: { path: "/explore/search-results", label: "Explore the data" },
	browse: { path: "/browse/authors", label: "Browse the data" },
	"case-studies": { path: "/case-studies", label: "Case studies" },
	about: { path: "/about", label: "About the project" },
};

const isNavigationMenuOpen = ref(false);

function onToggleNavigationMenu() {
	isNavigationMenuOpen.value = !isNavigationMenuOpen.value;
}
</script>

<template>
	<header class="border-b border-neutral-200">
		<nav
			aria-label="Main"
			class="mx-auto flex w-full max-w-7xl items-center justify-between gap-8 px-8 py-4"
		>
			<div class="flex items-center gap-2">
				<button
					class="flex items-center gap-2 rounded-full p-1 transition hover:text-neutral-700 md:hidden"
					@click="onToggleNavigationMenu"
				>
					<span class="sr-only">Toggle navigation menu</span>
					<MenuIcon class="h-6 w-6" />
				</button>

				<NuxtLink class="text-3xl font-bold transition hover:text-neutral-700 md:text-4xl" href="/">
					MMP
				</NuxtLink>
			</div>

			<ul class="hidden flex-wrap justify-end font-medium md:flex" role="list">
				<li v-for="(link, key, index) of links" :key="key">
					<span v-if="index !== 0" aria-hidden class="mx-4 select-none">&bull;</span>
					<NuxtLink class="transition hover:text-neutral-700" :href="{ path: link.path }">
						{{ link.label }}
					</NuxtLink>
				</li>
			</ul>
		</nav>
	</header>
</template>
