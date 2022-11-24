<template>
  <v-navigation-drawer permanent fixed right color="#F1F5FA" :width="drawerWidth">
    <v-list-item>
      <v-list-item-action>
        <router-link
          :to="{ name: fullscreen ? 'Map Fullscreen' : 'Map', query: $route.query }"
          class="text-decoration-none"
        >
          <v-icon>mdi-close</v-icon>
        </router-link>
      </v-list-item-action>
      <v-list-item-title> Keyword(s) found at point </v-list-item-title>
    </v-list-item>
    <v-divider />
    <v-list v-if="!isLoading" v-model="data">
      <v-list v-for="d in data" :key="d.id">
        <v-list-item @mouseover="highlightSpatCov(d.id)" @mouseout="playdownSpatCov(d.id)">
          <v-list-item-content>
            <v-list-item-title class="text-h5">
              Keyword: {{ d.properties.key_word.stichwort }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ d.properties.key_word.art }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-subheader hide-details>Texts</v-subheader>
        <v-list-item v-for="text in removeDuplicates(d.properties.texts, ['id'])" :key="text.id">
          <v-list>
            <v-list-item-content>
              <v-list-item-title>
                {{ text.title }}
              </v-list-item-title>
              <v-list-item-subtitle v-if="text.authors.length">
                {{ text.authors.map((x) => x.name).join(', ') }}
              </v-list-item-subtitle>
              <v-list-item-subtitle v-if="text.places.length">
                <!-- {{ text.places.map((x) => x.name).join(', ') }} -->
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list>
        </v-list-item>
        <v-subheader>Passages</v-subheader>
        <v-list-item
          v-for="passage in d.properties.stelle"
          :key="passage.id"
          :to="{
            name: fullscreen ? 'Passage Detail Fullscreen' : 'Passage Detail',
            query: addParamsToQuery({ Passage: passage.id }),
            params: { id: passage.id },
          }"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ passage.display_label }}
            </v-list-item-title>
            <v-list-item-subtitle v-if="passage.start_date || passage.end_date">
              {{ displayTimeRange(passage.start_date, passage.end_date) }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-divider />
      </v-list>
    </v-list>
    <v-list v-else>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            <v-skeleton-loader type="sentences@7" />
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

import { useSpatialCoverageGeojsonById } from '@/api';
import helpers from '@/helpers';

export default {
  name: 'SpatialDetails',
  mixins: [helpers],
  setup() {
    const route = useRoute();
    // FIXME: currently the map view encodes multiple ids as path param when a point is clicked
    // which has multiple overlapping spatial coverages, which is a really bad idea
    const id = computed(() =>
      route.params.id.startsWith('[')
        ? route.params.id.slice(1, -1).split(',').map(Number)[0]
        : Number(route.params.id)
    );

    const spatialCoverageQuery = useSpatialCoverageGeojsonById({ id });

    const isLoading = computed(() => spatialCoverageQuery.isInitialLoading.value);

    const spatialCoverage = computed(() => spatialCoverageQuery.data.value);

    // FIXME: only temporary
    const data = computed(() => {
      if (spatialCoverage.value == null) return [];
      return [spatialCoverage.value];
    });

    return {
      isLoading,
      data,
    };
  },
  data: () => ({
    strokeColor: '',
  }),
  methods: {
    highlightSpatCov(id) {
      if (this.$root.$refs.map.$refs.spatCov !== undefined) {
        this.$root.$refs.map.highlightPoly(id, 'spatCov', '#ffa500');
      } else {
        this.$root.$refs.map.enableSpatCov(id);
      }

      if (document.getElementsByClassName(`labelText ${id}`)[0]) {
        const colour = 'rgb(255,255,0)';

        for (let label of document.getElementsByClassName('labelText')) {
          label.style.opacity = 0.3;
        }
        document.getElementsByClassName(
          `labelText ${id}`
        )[0].style.textShadow = `0px 0px, ${colour} -2px 0px 0px, ${colour} 0px 2px 0px, ${colour} 0px -2px 0px, ${colour} 1px 1px, ${colour} -1px -1px 0px, ${colour} 1px -1px 0px, ${colour} -1px 1px 0px`;
        document.getElementsByClassName(`labelText ${id}`)[0].style.opacity = 1;
      }
    },
    playdownSpatCov(id) {
      if (this.$root.$refs.map.$refs.spatCov !== undefined) {
        this.$root.$refs.map.playdownPoly(id, 'spatCov');
      } else {
        this.$root.$refs.map.disableSpatCov();
      }
      if (document.getElementsByClassName(`labelText ${id}`)[0]) {
        const colour = 'rgb(255,255,255)';
        document.getElementsByClassName(
          `labelText ${id}`
        )[0].style.textShadow = `0px 0px, ${colour} -2px 0px 0px, ${colour} 0px 2px 0px, ${colour} 0px -2px 0px, ${colour} 1px 1px, ${colour} -1px -1px 0px, ${colour} 1px -1px 0px, ${colour} -1px 1px 0px`;

        for (let label of document.getElementsByClassName('labelText')) {
          label.style.opacity = 1;
        }
      }
    },
  },
};
</script>
