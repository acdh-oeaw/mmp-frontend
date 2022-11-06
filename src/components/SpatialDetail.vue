<template>
  <v-navigation-drawer permanent fixed right color="#F1F5FA" :width="drawerWidth">
    <v-list-item>
      <v-list-item-action>
        <router-link :to="{ name: fullscreen ? 'Map Fullscreen' : 'Map', query: $route.query }"
          class="text-decoration-none">
          <v-icon>mdi-close</v-icon>
        </router-link>
      </v-list-item-action>
      <v-list-item-title>
        Keyword(s) found at point
      </v-list-item-title>
    </v-list-item>
    <v-divider />
    <v-list v-model="data" v-if="!loading">
      <v-list v-for="d in data" :key="d.id">
        <v-list-item v-on:mouseover="highlightSpatCov(d.id)" v-on:mouseout="playdownSpatCov(d.id)">
          <v-list-item-content>
            <template v-if="!loading">
              <v-list-item-title class="text-h5">
                Keyword: {{ d.properties.key_word.stichwort }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ d.properties.key_word.art }}
              </v-list-item-subtitle>
            </template>
            <v-skeleton-loader v-else type="heading, text@2" />
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
        <v-list-item v-for="passage in d.properties.stelle" :key="passage.id" :to="{
              name: fullscreen ? 'Passage Detail Fullscreen' : 'Passage Detail',
              query: addParamsToQuery({ Passage: passage.id }),
              params: { id: passage.id }}">
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
import helpers from '@/helpers';

export default {
  name: 'SpatialDetails',
  data: () => ({
    loading: false,
    data: [],
    strokeColor: '',
  }),
  mixins: [helpers],
  watch: {
    '$route.params': {
      handler(params) {
        let arr = JSON.parse(params.id);
        if (typeof arr === 'number') {
          const arr2 = [arr];
          arr = arr2;
        }
        console.log('place params', params, typeof params, arr, typeof arr);
        this.data = [];
        arr.forEach((param) => {
          this.loading = true;
          const address = `${process.env.VUE_APP_MMP_API_BASE_URL}/api/spatialcoverage/${param}`;
          const prefetched = this.$store.state.fetchedResults[address];
          if (prefetched) {
            this.data.push(prefetched);
            this.loading = false;
          } else {
            fetch(address)
              .then((res) => res.json())
              .then((jsonRes) => {
                this.data.push(jsonRes);
                this.$store.commit('addToResults', { req: address, res: jsonRes });
              })
              .catch((err) => {
                console.error(err);
              })
              .finally(() => {
                this.loading = false;
              });
          }
        });
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    highlightSpatCov(id) {
      if (this.$root.$refs.map.$refs.spatCov !== undefined) {
        this.$root.$refs.map.highlightPoly(id, 'spatCov', '#ffa500');
      } else {
        this.$root.$refs.map.enableSpatCov(id);
      }
      if (document.getElementsByClassName(`labelText ${id}`)[0]) {
        const colour = 'rgb(255,255,0)';
        // eslint-disable-next-line
        for (let label of document.getElementsByClassName('labelText')) {
          label.style.opacity = 0.3;
        }
        document.getElementsByClassName(`labelText ${id}`)[0].style.textShadow = `0px 0px, ${colour} -2px 0px 0px, ${colour} 0px 2px 0px, ${colour} 0px -2px 0px, ${colour} 1px 1px, ${colour} -1px -1px 0px, ${colour} 1px -1px 0px, ${colour} -1px 1px 0px`;
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
        document.getElementsByClassName(`labelText ${id}`)[0].style.textShadow = `0px 0px, ${colour} -2px 0px 0px, ${colour} 0px 2px 0px, ${colour} 0px -2px 0px, ${colour} 1px 1px, ${colour} -1px -1px 0px, ${colour} 1px -1px 0px, ${colour} -1px 1px 0px`;
        // eslint-disable-next-line
        for (let label of document.getElementsByClassName('labelText')) {
          label.style.opacity = 1;
        }
      }
    },
  },
};
</script>
