<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

import CaseStudyStory from '@/components/case-study-story.vue';

const route = useRoute();
const id = computed(() => {
	return Number(route.params['id']);
});
</script>

<template>
	<CaseStudyStory :id="id" />
</template>
