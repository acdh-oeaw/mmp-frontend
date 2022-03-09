<template>
  <v-navigation-drawer
    permanent
    fixed
    right
    color="#F1F5FA"
    :width="drawerWidth"
  >
    <v-list-item>
      <v-list-item-action>
        <router-link :to="{ name: fullscreen ? 'Map Fullscreen' : 'Map', query: $route.query }" class="text-decoration-none">
          <v-icon>mdi-close</v-icon>
        </router-link>
      </v-list-item-action>
      <v-list-item-content>
        <template v-if="!loading">
          <v-list-item-title class="text-h5">
            {{ getOptimalName(data.ort) }}
          </v-list-item-title>
          <v-list-item-subtitle v-if="data.ort.name_antik">
            {{ data.ort.name_antik }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            {{ data.ort.lat }}, {{ data.ort.long }}
          </v-list-item-subtitle>
        </template>
        <v-skeleton-loader
          v-else
          type="heading, text@2"
        />
      </v-list-item-content>
    </v-list-item>
    <v-divider />
    <v-container>
      <v-expansion-panels
        flat
        accordion
        v-if="!loading"
        multiple
        :value="[0, 1]"
      >
        <v-expansion-panel :disabled="!data.authors.count">
          <v-expansion-panel-header>
            <template v-slot:actions>
              <v-chip
                small
                color="red lighten-3"
                :disabled="!data.authors.count"
              >{{ data.authors.count }}</v-chip>
              <v-icon>mdi-chevron-down</v-icon>
            </template>
            Authors
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list-item
              v-for="author in data.authors.results"
              :key="author.url"
              :to="{ name: fullscreen ? 'Author Detail Fullscreen' : 'Author Detail',
                query: { Author: getIdFromUrl(author.url) },
                params: { id: getIdFromUrl(author.url) }
              }"
            >
            <v-list-item-content>
              <v-list-item-title>{{ getOptimalName(author) }}</v-list-item-title>
              <v-list-item-subtitle v-if="author.kommentar">{{ author.kommentar }}</v-list-item-subtitle>
              <v-list-item-subtitle>{{ author.jahrhundert }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>mdi-chevron-right</v-icon>
            </v-list-item-icon>
            </v-list-item>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel :disabled="!data.texts.count">
          <v-expansion-panel-header>
            <template v-slot:actions>
              <v-chip
                small
                color="red darken-3"
                dark
                :disabled="!data.texts.count"
              >
                {{ data.texts.count }}
              </v-chip>
              <v-icon>mdi-chevron-down</v-icon>
            </template>
            Texts
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list-item
              v-for="text in data.texts.results"
              :key="text.url"
              two-line
            >
            <v-list-item-content>
              <v-list-item-title>{{ text.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ text.autor.map((x) => getOptimalName(x)).join(', ') }}</v-list-item-subtitle>
              <v-list-item-subtitle>{{ text.jahrhundert }}</v-list-item-subtitle>
            </v-list-item-content>
            </v-list-item>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-skeleton-loader
        v-else
        type="paragraph@2"
      />
    </v-container>
  </v-navigation-drawer>
</template>

<script>
import helpers from '@/helpers';

export default {
  name: 'PlaceDetail',
  data: () => ({
    loading: false,
    data: {
      place: null,
      texts: null,
      authors: null,
    },
  }),
  mixins: [helpers],
  watch: {
    '$route.params': {
      handler(params) {
        console.log('place params', params);
        this.loading = true;
        const urls = [
          `https://mmp.acdh-dev.oeaw.ac.at/api/ort/${params.id}/?format=json`,
          `https://mmp.acdh-dev.oeaw.ac.at/api/text/?ort=${params.id}&format=json`,
          `https://mmp.acdh-dev.oeaw.ac.at/api/autor/?ort=${params.id}&format=json`,
        ];
        const prefetched = this.$store.state.fetchedResults[urls.toString()];

        if (prefetched) {
          console.log('prefetched places', prefetched);
          this.loading = false;
        } else {
          Promise.all(urls.map((x) => fetch(x)))
            .then((res) => {
              Promise.all(res.map((x) => x.json()))
                .then((jsonRes) => {
                  console.log('place res', jsonRes);
                  this.$store.commit('addToResults', { req: urls.toString(), jsonRes });
                  [this.data.ort, this.data.texts, this.data.authors] = jsonRes;
                })
                .catch((err) => {
                  console.error(err);
                })
                .finally(() => {
                  this.loading = false;
                });
            });
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
