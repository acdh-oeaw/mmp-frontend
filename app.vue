<script lang="ts" setup>
import RouteAnnouncer from "@/components/route-announcer.vue";
import SkipLink from "@/components/skip-link.vue";
import { metadata } from "@/config/metadata.config";
import { isNotNullable } from "@/lib/is-not-nullable";
import { NuxtLayout, NuxtPage } from "#components";
import { useHead } from "#imports";

useHead({
	titleTemplate(title) {
		return [title, metadata.title].filter(isNotNullable).join(" - ");
	},
});
</script>

<template>
	<SkipLink />
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
	<RouteAnnouncer />
</template>
