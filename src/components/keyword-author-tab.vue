<script lang="ts" setup>
import { computed } from 'vue';

import type { Author, GetPassages, Passage, Text } from '@/api';
import { getAuthorLabel } from '@/lib/get-label';
import { isNotNullable } from '@/lib/is-not-nullable';
import { keywordColors } from '@/lib/search/search.config';
import { useSearchFilters } from '@/lib/search/use-search-filters';

const props = defineProps<{
  passages: GetPassages.Response['results'];
}>();

const { createSearchFilterParams, searchFilters } = useSearchFilters();

const texts = computed(() => {
  return props.passages.map((passage) => passage.text).filter(isNotNullable);
});

const authors = computed(() => {
  const authorsById = new Map();

  texts.value.forEach((text) => {
    text.autor.forEach((author) => {
      authorsById.set(author.id, author);
    });
  });

  return Array.from(authorsById.values());
});

function getTextsByAuthor(id: Author['id'], texts: Array<Text>) {
  const textsById = new Map();

  texts.forEach((text) => {
    if (text.autor.some((author) => author.id === id)) {
      textsById.set(text.id, text);
    }
  });

  return Array.from(textsById.values());
}

function getPassagesByText(id: Text['id'], passages: Array<Passage>) {
  return passages.filter((passage) => passage.text?.id === id);
}

function getPassagesByAuthor(id: Author['id'], passages: Array<Passage>) {
  return passages.filter((passage) => passage.text?.autor.map((autor) => autor.id).includes(id));
}
</script>

<template>
  <VList color="transparent">
    <div v-for="author of authors" :key="author.id">
      <VListGroup prepend-icon="mdi-account-edit">
        <template #activator>
          <VListItem>
            <VListItemContent>
              <VListItemTitle>
                {{ getAuthorLabel(author) }}
              </VListItemTitle>
              <VListItemSubtitle>
                {{ getTextsByAuthor(author.id, texts).length }}
                text{{ getTextsByAuthor(author.id, texts).length === 1 ? '' : 's' }} and
              </VListItemSubtitle>
              <VListItemSubtitle>
                {{ getPassagesByAuthor(author.id, passages).length }} passage{{
                  getPassagesByAuthor(author.id, passages).length === 1 ? '' : 's'
                }}
                found.
              </VListItemSubtitle>
            </VListItemContent>
          </VListItem>
        </template>
        <VListGroup
          v-for="text of getTextsByAuthor(author.id, texts)"
          :key="text.id"
          :ripple="false"
          prepend-icon="mdi-book-open-variant"
          sub-group
          no-action
        >
          <template #activator>
            <VListItem>
              <VListItemContent>
                <VListItemTitle>
                  {{ text.title }}
                </VListItemTitle>
                <VListItemSubtitle>
                  {{ getPassagesByText(text.id, passages).length }} passage{{
                    getPassagesByText(text.id, passages).length === 1 ? '' : 's'
                  }}
                </VListItemSubtitle>
              </VListItemContent>
            </VListItem>
          </template>
          <VListItem
            v-for="passage of getPassagesByText(text.id, passages)"
            :key="passage.id"
            :to="{
              name: 'search-results',
              query: createSearchFilterParams({ ...searchFilters, passage: [passage.id] }),
            }"
            prepend-icon="mdi-format-quote-close"
          >
            <div class="passage-list-item">
              {{ passage.display_label }}
              <VChipGroup column>
                <VChip
                  v-for="keyword of passage.key_word"
                  :key="keyword.id"
                  :color="keywordColors[keyword.art]"
                  small
                >
                  {{ keyword.stichwort }}
                </VChip>
              </VChipGroup>
            </div>
            <VIcon>mdi-chevron-right</VIcon>
          </VListItem>
        </VListGroup>
      </VListGroup>
      <VDivider inset />
    </div>
  </VList>
</template>

<style>
.passage-list-item {
  padding: 5px 0;
}

.v-chip-group .v-chip {
  margin: 2px 4px 2px 0;
}
</style>
