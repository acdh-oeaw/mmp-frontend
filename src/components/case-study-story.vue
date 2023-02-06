<script lang="ts" setup>
import { computed } from 'vue';

import type { CaseStudy } from '@/api';
import { useCaseStudyById } from '@/api';

const props = defineProps<{
	id: CaseStudy['id'];
}>();

const caseStudyQuery = useCaseStudyById({ id: props.id });

const caseStudy = computed(() => {
	return caseStudyQuery.data.value;
});
</script>

<template>
	<div v-if="caseStudy != null" v-html="caseStudy.story_map" />
</template>
