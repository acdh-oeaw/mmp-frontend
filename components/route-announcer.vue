<script lang="ts" setup>
import { ref } from "vue";
import type { RouteLocationNormalized } from "vue-router";

import { isNonEmptyString } from "@/lib/is-nonempty-string";
import { trackPageView } from "@/lib/matomo-analytics";
import { useRouter } from "#imports";

const router = useRouter();

const message = ref("");

/**
 * TODO: Add page metadata with `definePageMeta`.
 */
function onChangeMessaqge(to: RouteLocationNormalized) {
	if (typeof to.meta.title === "string") {
		message.value = to.meta.title;
	} else {
		/**
		 * The `afterEach` callback runs *before* dom updates, so we need to wait a render
		 * pass for `document.title` and `h1` to be updated.
		 *
		 * Looks like there is no lifecycle hook which runs *after* dom updates:
		 *
		 * @see https://router.vuejs.org/guide/advanced/navigation-guards.html#the-full-navigation-resolution-flow
		 */
		setTimeout(() => {
			if (document.title) {
				message.value = document.title;
			} else {
				const h1 = document.querySelector("h1")?.textContent;

				if (isNonEmptyString(h1)) {
					message.value = h1;
				} else {
					message.value = to.path;
				}
			}
		}, 500);
	}
}

router.afterEach((to, from) => {
	if (to.path !== from.path) {
		onChangeMessaqge(to);
	}

	trackPageView(to, from);
});
</script>

<template>
	<div aria-live="assertive" class="sr-only" data-route-announcer role="alert">
		{{ message }}
	</div>
</template>
