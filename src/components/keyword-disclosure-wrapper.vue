<script lang="ts" setup>
import { type Keyword, type KeywordNormalized } from "@/api";
import { useKeywords } from "@/api";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";

import KeywordDisclosure from "./keyword-disclosure.vue";

const props = defineProps<{
	ids: Array<Keyword["id"]> | Array<KeywordNormalized["id"]>;
	noHeader?: boolean;
	label?: string;
	newTab?: boolean;
}>();

const keywordsQuery = useKeywords({
	ids: String(props.ids),
});

const { data, isLoading, isError, isFetching } = keywordsQuery;
</script>
<template>
	<template v-if="isLoading">
		<Centered>
			<LoadingIndicator>Loading author...</LoadingIndicator>
		</Centered>
	</template>

	<template v-else-if="isError">
		<Centered>
			<ErrorMessage>Failed to load author.</ErrorMessage>
		</Centered>
	</template>

	<template v-else>
		<template v-if="isFetching">
			<Centered>
				<LoadingIndicator>Updating author...</LoadingIndicator>
			</Centered>
		</template>
		<KeywordDisclosure
			v-if="data"
			:keywords="data.results"
			:new-tab="newTab"
			:label="label"
			:no-header="noHeader"
		/>
	</template>
</template>
