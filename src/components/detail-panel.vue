<script lang="ts" setup>
import { computed } from 'vue';
import { VNavigationDrawer } from 'vuetify/lib';

import AuthorDetail from '@/components/author-detail.vue';
import KeywordDetail from '@/components/keyword-detail.vue';
import PassageDetail from '@/components/passage-detail.vue';
import PlaceDetail from '@/components/place-detail.vue';
import SpatialCoverageDetail from '@/components/spatial-coverage-detail.vue';
import { useDetailsSearchFilters } from '@/lib/search/use-details-search-filters';
import { useDrawerWidth } from '@/lib/use-drawer-width';

const { searchFilters } = useDetailsSearchFilters();

const kind = computed(() => searchFilters.value['detail-kind']);
const ids = computed(() => searchFilters.value['detail-id']);
const isOpen = computed(() => {
  return kind.value != null && ids.value.length > 0;
});

const drawerWidth = useDrawerWidth();
</script>

<template>
  <VNavigationDrawer
    app
    color="background"
    fixed
    permanent
    right
    :value="isOpen"
    :width="drawerWidth"
  >
    <AuthorDetail v-if="kind === 'author'" />
    <KeywordDetail v-else-if="kind === 'keyword'" />
    <PassageDetail v-else-if="kind === 'passage'" />
    <PlaceDetail v-else-if="kind === 'place'" />
    <SpatialCoverageDetail v-else-if="kind === 'spatial-coverage'" />
  </VNavigationDrawer>
</template>
