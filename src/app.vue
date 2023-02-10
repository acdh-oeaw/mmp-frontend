<script lang="ts" setup>
import { NuxtLayout, NuxtPage } from "#components";
import { useHead } from "#imports";
import { metadata } from "~/config/metadata.config";

useHead({
	titleTemplate(title) {
		return [title, metadata.title].join(" - ");
	},
});
</script>

<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>
