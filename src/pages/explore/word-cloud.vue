<script lang="ts" setup>
import WordCloudWrapper from '@/components/word-cloud-wrapper.vue';
import { useWordCloudSearchParams } from '@/lib/search/use-word-cloud-search-params';

const searchParams = useWordCloudSearchParams();
</script>

<template>
	<WordCloudWrapper :search-params="searchParams" />
</template>
