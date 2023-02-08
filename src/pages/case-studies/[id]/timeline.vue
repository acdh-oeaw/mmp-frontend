<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

import CaseStudyTimeline from '@/components/case-study-timeline.vue';

const route = useRoute();
const id = computed(() => {
	return Number(route.params['id']);
});
</script>

<template>
	<CaseStudyTimeline :id="id" />
</template>
