<script lang="ts" setup>
import { DialogTitle } from "@headlessui/vue";
import { Bars3Icon as MenuIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";

import SideDialog from "@/components/side-dialog.vue";
import { NuxtLink } from "#components";
import { useRouter } from "#imports";

const links = {
	explore: { path: "/explore/search-results", label: "Search the data" },
	browse: { path: "/browse/authors", label: "Browse the data" },
	"case-studies": { path: "/case-studies", label: "Case studies" },
	about: { path: "/about", label: "About the project" },
};

const router = useRouter();

const isNavigationMenuOpen = ref(false);

function onToggleNavigationMenu() {
	isNavigationMenuOpen.value = !isNavigationMenuOpen.value;
}

router.beforeEach(() => {
	isNavigationMenuOpen.value = false;
});
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
					<MenuIcon class="size-6" />
				</button>

				<NuxtLink class="text-3xl font-bold transition hover:text-neutral-700 md:text-4xl" href="/">
					MMP
				</NuxtLink>
			</div>

			<ul class="hidden flex-wrap justify-end font-medium md:flex" role="list">
				<li v-for="(link, key, index) of links" :key="key">
					<span v-if="index !== 0" aria-hidden="true" class="mx-4 select-none">&bull;</span>
					<NuxtLink class="transition hover:text-neutral-700" :href="{ path: link.path }">
						{{ link.label }}
					</NuxtLink>
				</li>
			</ul>

			<SideDialog :open="isNavigationMenuOpen" @toggle="onToggleNavigationMenu">
				<DialogTitle as="h2" class="sr-only">Navigation menu</DialogTitle>

				<ul class="grid divide-y px-4 font-medium" role="list">
					<li>
						<NuxtLink class="flex p-4 transition hover:bg-neutral-50" href="/">Home</NuxtLink>
					</li>
					<li v-for="(link, key) of links" :key="key">
						<NuxtLink class="flex p-4 transition hover:bg-neutral-50" :href="{ path: link.path }">
							{{ link.label }}
						</NuxtLink>
					</li>
				</ul>
			</SideDialog>
		</nav>
	</header>
</template>
