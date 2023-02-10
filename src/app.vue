<script lang="ts" setup>
import { isNotNullable } from "@/lib/is-not-nullable";
import { NuxtLayout, NuxtPage } from "#components";
import { useHead } from "#imports";
import { metadata } from "~/config/metadata.config";

useHead({
	titleTemplate(title) {
		return [title, metadata.title].filter(isNotNullable).join(" - ");
	},
});
</script>

<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>
