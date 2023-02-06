<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

import { usePassages } from '@/api';
import KeywordAuthorTab from '@/components/keyword-author-tab.vue';

const route = useRoute();
const id = computed(() => {
	return Number(route.params['id']);
});

const passageQuery = usePassages({ use_case: [id], limit: 200 });

const passages = computed(() => {
	return passageQuery.data.value?.results ?? [];
});
</script>

<template>
	<KeywordAuthorTab :passages="passages" />
</template>
