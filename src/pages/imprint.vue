<script lang="ts" setup>
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import MainContent from "@/components/main-content.vue";
import { useImprint } from "@/lib/use-imprint";
import { useHead } from "#imports";

const title = "Imprint";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const imprintQuery = useImprint();
const isLoading = imprintQuery.isInitialLoading;
const isError = imprintQuery.isError;
const imprint = imprintQuery.data;

await imprintQuery.suspense();
</script>

<template>
	<MainContent>
		<div class="mx-auto w-full max-w-4xl px-8 py-4">
			<h1>Imprint</h1>

			<template v-if="isLoading">
				<LoadingIndicator>Loading imprint...</LoadingIndicator>
			</template>

			<template v-else-if="isError">
				<ErrorMessage>Failed to load imprint.</ErrorMessage>
			</template>

			<template v-else-if="imprint == null">
				<NothingFoundMessage></NothingFoundMessage>
			</template>

			<template v-else>
				<!-- eslint-disable-next-line vue/no-v-html -->
				<div class="prose-sm" v-html="imprint" />
			</template>
		</div>
	</MainContent>
</template>
