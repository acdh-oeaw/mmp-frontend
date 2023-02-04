<script lang="ts" setup>
import { computed } from 'vue';

import { useCaseStudies } from '@/api';
import CaseStudiesSearchForm from '@/components/case-studies-search-form.vue';
import { useCaseStudiesSearchParams } from '@/lib/search/use-case-studies-search-params';

const searchParams = useCaseStudiesSearchParams();
const caseStudiesQuery = useCaseStudies(searchParams);

const _isFetching = computed(() => {
  return caseStudiesQuery.isFetching.value;
});

const _isLoading = computed(() => {
  return caseStudiesQuery.isInitialLoading.value;
});

const caseStudies = computed(() => {
  return caseStudiesQuery.data.value?.results ?? [];
});
</script>

<template>
  <VContainer>
    <VRow>
      <VCol offset="0" offset-lg="4" cols="12" lg="6">
        <CaseStudiesSearchForm />
      </VCol>
    </VRow>

    <VRow justify="center">
      <VCol cols="12" lg="8">
        <!-- TODO: loading indicator, nothing found message -->
        <VCard v-for="caseStudy of caseStudies" :key="caseStudy.id" class="case-study-card">
          <VCardTitle>{{ caseStudy.title }}</VCardTitle>
          <VCardSubtitle v-if="caseStudy.principal_investigator">
            {{ caseStudy.principal_investigator }}
          </VCardSubtitle>
          <VCardText v-if="caseStudy.description">{{ caseStudy.description }}</VCardText>
          <VCardActions>
            <VBtn text :to="{ name: 'case-study', params: { id: caseStudy.id } }">Read More</VBtn>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<style scoped>
.case-study-card {
  margin-bottom: 20px;
}
</style>
