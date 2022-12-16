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
                {{ getPassagesByAuthor(author.id, data).length }} passage{{
                  getPassagesByAuthor(author.id, data).length === 1 ? '' : 's'
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
                  {{ getPassagesByText(text.id, data).length }} passage{{
                    getPassagesByText(text.id, data).length === 1 ? '' : 's'
                  }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-list-item
            v-for="passage in getPassagesByText(text.id, data)"
            :key="passage.id"
            :to="{
              name: 'List',
              query: addParamsToQuery({ Passage: passage.id }),
            }"
            prepend-icon="mdi-format-quote-close"
          >
            {{ passage.display_label }}
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
  props: ['data'],
  setup(props) {
    //console.log('props', props);
    const texts = computed(() => {
      return props.data.map((passage) => passage.text).filter(isNotNullable);
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
