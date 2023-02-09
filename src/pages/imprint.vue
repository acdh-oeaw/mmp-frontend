<script lang="ts" setup>
import { request } from '@stefanprobst/request';
import { useQuery } from '@tanstack/vue-query';

import LoadingIndicator from '@/components/loading-indicator.vue';
import { url } from '~/config/imprint.config';

function getImprint() {
	return request(url, { responseType: 'text' });
}

function useImprintHtml() {
	return useQuery(['imprint'], getImprint);
}

const { data: html, isInitialLoading } = useImprintHtml();
</script>

<template>
	<div>
		<h1>Imprint</h1>
		<div class="d-flex justify-center">
			<LoadingIndicator v-if="isInitialLoading" />
		</div>
		<div v-if="!isInitialLoading && html != null" v-html="html" />
	</div>
</template>
