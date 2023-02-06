<script lang="ts" setup>
import NetworkGraphWrapper from '@/components/network-graph-wrapper.vue';
import { useNetworkGraphSearchParams } from '@/lib/search/use-network-graph-search-params';

const searchParams = useNetworkGraphSearchParams();
</script>

<template>
	<NetworkGraphWrapper :search-params="searchParams" />
</template>
