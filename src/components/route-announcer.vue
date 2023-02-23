<script lang="ts" setup>
import { ref } from "vue";
import { type RouteLocationNormalized } from "vue-router";

import { isNonEmptyString } from "@/lib/is-nonempty-string";
import { useRouter } from "#imports";

const router = useRouter();

const message = ref("");

/**
 * TODO: Add page metadata with `definePageMeta`.
 */
function onChangeMessaqge(to: RouteLocationNormalized) {
	if (typeof to.meta["title"] === "string") {
		message.value = to.meta["title"];
	} else if (document.title) {
		message.value = document.title;
	} else {
		const h1 = document.querySelector("h1")?.textContent;

		if (isNonEmptyString(h1)) {
			message.value = h1;
		} else {
			message.value = to.path;
		}
	}
}

/**
 * FIXME: Figure out when it is safe to read `document.title`. In the `afterEach`
 * callback, it has *not* yet been updated. Wrapping in `nextTick` does not help either.
 * See the router lifecycle:
 * @see https://router.vuejs.org/guide/advanced/navigation-guards.html#the-full-navigation-resolution-flow
 */
router.afterEach((to, from) => {
	if (to.path !== from.path) {
		// onChangeMessaqge(to);
	}
});
</script>

<template>
	<div aria-live="assertive" class="sr-only" data-route-announcer role="alert">
		{{ message }}
	</div>
</template>
