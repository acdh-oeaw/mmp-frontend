<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

import type { Author, Passage, Text } from '@/api';
import { getAuthorLabel } from '@/lib/get-label';
import { isNotNullable } from '@/lib/is-not-nullable';
import { keywordColors } from '@/lib/search/search.config';

const props = defineProps<{
  passages: Array<Passage>;
}>();

const route = useRoute();

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
  <v-list color="transparent">
    <div v-for="author of authors" :key="author.id">
      <v-list-group prepend-icon="mdi-account-edit">
        <template #activator>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                {{ getAuthorLabel(author) }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ getTextsByAuthor(author.id, texts).length }}
                text{{ getTextsByAuthor(author.id, texts).length === 1 ? '' : 's' }} and
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                {{ getPassagesByAuthor(author.id, passages).length }} passage{{
                  getPassagesByAuthor(author.id, passages).length === 1 ? '' : 's'
                }}
                found.
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
        <v-list-group
          v-for="text of getTextsByAuthor(author.id, texts)"
          :key="text.id"
          :ripple="false"
          prepend-icon="mdi-book-open-variant"
          sub-group
          no-action
        >
          <template #activator>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  {{ text.title }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ getPassagesByText(text.id, passages).length }} passage{{
                    getPassagesByText(text.id, passages).length === 1 ? '' : 's'
                  }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-list-item
            v-for="passage of getPassagesByText(text.id, passages)"
            :key="passage.id"
            :to="{
              name: 'List',
              query: { ...route.query, Passage: passage.id },
            }"
            prepend-icon="mdi-format-quote-close"
          >
            <div class="passage-list-item">
              {{ passage.display_label }}
              <v-chip-group column>
                <v-chip
                  v-for="keyword of passage.key_word"
                  :key="keyword.id"
                  :color="keywordColors[keyword.art]"
                  small
                >
                  {{ keyword.stichwort }}
                </v-chip>
              </v-chip-group>
            </div>
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item>
        </v-list-group>
      </v-list-group>
      <v-divider inset />
    </div>
  </v-list>
</template>

<style>
.passage-list-item {
  padding: 5px 0;
}

.v-chip-group .v-chip {
  margin: 2px 4px 2px 0;
}
</style>
