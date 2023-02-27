<script lang="ts" setup>
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import MainContent from "@/components/main-content.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
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
			<h1 class="sr-only">Imprint</h1>

			<template v-if="isLoading">
				<Centered>
					<LoadingIndicator>Loading imprint...</LoadingIndicator>
				</Centered>
			</template>

			<template v-else-if="isError">
				<Centered>
					<ErrorMessage>Failed to load imprint.</ErrorMessage>
				</Centered>
			</template>

			<template v-else-if="imprint == null">
				<Centered>
					<NothingFoundMessage></NothingFoundMessage>
				</Centered>
			</template>

			<template v-else>
				<!-- eslint-disable-next-line vue/no-v-html -->
				<div class="prose-sm" v-html="imprint" />
			</template>
		</div>
	</MainContent>
</template>
