<script lang="ts" setup>
import GeoMapWrapper from '@/components/geo-map-wrapper.vue';
import { useGeoMapSearchParams } from '@/lib/search/use-geo-map-search-params';

const searchParams = useGeoMapSearchParams();
</script>

<template>
	<GeoMapWrapper :search-params="searchParams" />
</template>
