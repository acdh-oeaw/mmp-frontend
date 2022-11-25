<template>
  <v-navigation-drawer permanent fixed right color="#F1F5FA" :width="drawerWidth">
    <v-list-item>
      <v-list-item-action>
        <router-link
          :to="{ name: isFullScreen ? 'List Fullscreen' : 'List', query: $route.query }"
          class="text-decoration-none"
        >
          <v-icon>mdi-close</v-icon>
        </router-link>
      </v-list-item-action>
      <v-list-item-content>
        <div v-if="!isLoading">
          <v-list-item-title class="text-h5">
            {{ title.title }}
          </v-list-item-title>
          <v-list-item-subtitle>
            <!-- this is a weird way to ensure the colon is only displayed when both these values have been loaded -->
            {{ [title.written, title.author].join(', ') }}
          </v-list-item-subtitle>
        </div>
        <v-skeleton-loader v-else type="heading, text" />
      </v-list-item-content>
    </v-list-item>
    <v-divider />
    <v-simple-table v-if="!isLoading" class="data-table">
      <tbody>
        <tr v-for="item in items" :key="item.key">
          <td class="grey--text text--darken-1">
            {{ item.key }}
          </td>
          <td v-if="item.key === 'Keywords'">
            <div v-for="keyword in item.value" :key="keyword.id" class="keyword-chip">
              <v-chip
                :color="keyColors.chips[keyword.art]"
                small
                @click="
                  $store.commit('addAutoCompleteSelectedValues', {
                    id: keyword.id,
                    label: keyword.stichwort,
                    kind: 'keyword',
                  })
                "
              >
                {{ keyword.stichwort }}
              </v-chip>
            </div>
          </td>
          <td v-else-if="['Place', 'Author'].includes(item.key)">
            <router-link
              v-for="(val, i) in item.value"
              :key="val.id"
              :to="{
                name: isFullScreen ? `${item.key} Detail Fullscreen` : `${item.key} Detail`,
                query: item.key === 'Place' ? addParamsToQuery({ Place: val.id }) : $route.query,
                params: { id: val.id },
              }"
            >
              <span v-if="i != 0">, </span>
              {{ getOptimalName(val) }}
              <v-icon>mdi-chevron-right</v-icon>
            </router-link>
          </td>
          <td v-else>
            {{ item.value }}
          </td>
        </tr>
      </tbody>
    </v-simple-table>
    <v-container v-else>
      <v-skeleton-loader type="table-row-divider@11" />
    </v-container>
  </v-navigation-drawer>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

import { usePassageById } from '@/api';
import helpers from '@/helpers';

export default {
  name: 'PassasgeDetail',
  mixins: [helpers],
  setup() {
    const route = useRoute();
    const id = computed(() => Number(route.params.id));

    const passageQuery = usePassageById({ id });

    const isLoading = computed(() => passageQuery.isInitialLoading.value);
    const passage = computed(() => passageQuery.data.value);

    const title = computed(() => {
      if (passage.value == null) return {};

      return {
        title: passage.value.text.title,
        written:
          passage.value.text.start_date || passage.value.text.end_date
            ? `${passage.value.text.start_date || 'unknown'} - ${
                passage.value.text.end_date || 'unknown'
              }`
            : 'unknown',
        author: passage.value.text.autor.map((x) => x.name_en).join(', '),
      };
    });

    const items = computed(() => {
      if (passage.value == null) return [];

      return [
        {
          key: 'Keywords',
          value: passage.value.key_word,
        },
        {
          key: 'Translation',
          value: passage.value.translation,
        },
        {
          key: 'Original quote',
          value: passage.value.zitat,
        },
        {
          key: 'Title',
          value: title.value.title,
        },
        {
          key: 'Cited',
          value: passage.value.zitat_stelle,
        },
        {
          key: 'Summary',
          value: passage.value.summary,
        },
        {
          key: 'Author',
          value: passage.value.text.autor,
        },
        {
          key: 'Place',
          value: passage.value.text.ort,
        },
        {
          key: 'Edition',
          value: passage.value.text.edition,
        },
        {
          key: 'Text written in',
          value: title.value.written,
        },
        {
          key: 'Comment',
          value: passage.value.kommentar,
        },
      ];
    });

    return {
      isLoading,
      passage,
      items,
      title,
    };
  },
  data: () => ({
    headers: [
      { text: 'key', value: 'key' },
      { text: 'value', value: 'value' },
    ],
  }),
};
</script>
