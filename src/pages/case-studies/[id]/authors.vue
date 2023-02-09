<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

import { usePassages } from '@/api';
import KeywordAuthorTab from '@/components/keyword-author-tab.vue';
import LoadingIndicator from '@/components/loading-indicator.vue';

const route = useRoute();
const id = computed(() => {
	return Number(route.params['id']);
});

const passagesQuery = usePassages({ use_case: [id], limit: 200 });

const passages = computed(() => {
	return passagesQuery.data.value?.results ?? [];
});
</script>

<template>
	<div v-if="passagesQuery.isInitialLoading.value" class="d-flex justify-center">
		<LoadingIndicator />
	</div>
	<KeywordAuthorTab v-else :passages="passages" />
</template>
