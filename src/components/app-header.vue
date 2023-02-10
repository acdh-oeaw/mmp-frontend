<script lang="ts" setup>
import { Bars3Icon } from "@heroicons/vue/24/outline";
import { ref } from "vue";

import { NuxtLink } from "#components";

const links = {
	explore: { href: "/explore/search-results", label: "Explore the data" },
	browse: { href: "/browse/authors", label: "Browse the data" },
	"case-studies": { href: "/case-studies", label: "Case studies" },
	about: { href: "/about", label: "About the project" },
};

const isNavigationMenuOpen = ref(false);

function onToggleNavigationMenu() {
	isNavigationMenuOpen.value = !isNavigationMenuOpen.value;
}
</script>

<template>
	<header class="bg-primary text-white">
		<nav
			aria-label="Main"
			class="mx-auto flex w-full max-w-7xl items-center justify-between gap-8 px-8 py-6"
		>
			<div class="flex items-center gap-2">
				<button
					class="flex items-center gap-2 rounded-full p-1 transition hover:text-neutral-300 md:hidden"
					@click="onToggleNavigationMenu"
				>
					<span class="sr-only">Toggle navigation menu</span>
					<Bars3Icon class="h-6 w-6" />
				</button>

				<NuxtLink
					class="font-display text-3xl font-bold transition hover:text-neutral-300 md:text-4xl lg:text-5xl"
					href="/"
				>
					MMP
				</NuxtLink>
			</div>

			<ul class="hidden flex-wrap justify-end md:flex lg:text-xl" role="list">
				<li v-for="(link, key, index) of links" :key="key">
					<span v-if="index !== 0" aria-hidden class="mx-4 select-none">&bull;</span>
					<NuxtLink class="transition hover:text-neutral-300" :href="link.href">
						{{ link.label }}
					</NuxtLink>
				</li>
			</ul>
		</nav>
	</header>
</template>
