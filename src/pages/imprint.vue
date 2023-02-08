<script lang="ts" setup>
import { request } from '@stefanprobst/request';
import { useQuery } from '@tanstack/vue-query';
import { VSkeletonLoader } from 'vuetify/lib';

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
    <VSkeletonLoader v-if="isInitialLoading" />
    <div v-if="!isInitialLoading && html != null" v-html="html" />
  </div>
</template>
