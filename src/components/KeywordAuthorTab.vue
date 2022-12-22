<template>
  <v-list color="transparent">
    <div v-for="author in removeDuplicates(authors, 'id')" :key="author.id">
      <v-list-group prepend-icon="mdi-account-edit">
        <template #activator>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                {{ getOptimalName(author) }}
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
          v-for="text in getTextsByAuthor(author.id, texts)"
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
            v-for="passage in getPassagesByText(text.id, passages)"
            :key="passage.id"
            :to="{
              name: 'List',
              query: addParamsToQuery({ Passage: passage.id }),
            }"
            prepend-icon="mdi-format-quote-close"
          >
            <div class="passage-list-item">
              {{ passage.display_label }}
              <v-chip-group column>
                <v-chip
                  v-for="keyword in passage.key_word"
                  :key="keyword.id"
                  :color="keyColors.chips[keyword.art]"
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
<script>
import { computed } from 'vue';

import helpers from '@/helpers';
import { isNotNullable } from '@/lib/is-not-nullable';

export default {
  name: 'KeywordAuthorTab',
  mixins: [helpers],
  props: ['passages'],
  setup(props) {
    const texts = computed(() => {
      return props.passages.map((passage) => passage.text).filter(isNotNullable);
    });

    const authors = computed(() => {
      return texts.value.flatMap((text) => text.autor);
    });

    return {
      texts,
      authors,
    };
  },
};
</script>

<style>
.passage-list-item {
  padding: 5px 0;
}

.v-chip-group .v-chip {
  margin: 2px 4px 2px 0;
}
</style>
