<template>
  <v-card
    color="transparent"
    width="100%"
  >
    <leaflet :data="entries" :loading="loading" :usecase="usecase" />
    <!-- <div v-for="(feature, i) in featureList">
      <div
      class="card"
      :key="i+feature.properties.key_word.url"
      data-toggle="collapse"
      :data-target="`#${i+feature.properties.key_word.url}`"
      >
        <div class="card-header list">
          {{ feature.properties.key_word.stichwort }}
          <span class="badge badge-pill badge-primary">{{ feature.properties.stelle.length }}</span>
        </div>
      </div>
      <div class="card-body collapse" :id="i+feature.properties.key_word.url">
        <data-table :data="feature.properties.stelle" />
      </div>
    </div> -->
  <router-view />
  </v-card>
</template>

<script>
import Leaflet from './Leaflet';

export default {
  name: 'Map',
  components: {
    Leaflet,
  },
  props: ['usecase'],
  data: () => ({
    entries: [],
    loading: false,
  }),
  watch: {
    '$route.query': {
      handler(query) {
        let urls = [
          'https://mmp.acdh-dev.oeaw.ac.at/api/spatialcoverage/?format=json',
          'https://mmp.acdh-dev.oeaw.ac.at/api/cones/?format=json',
        ];
        if (this.usecase) {
          urls = urls.map((url) => `${url}&stelle__use_case=${this.usecase}`);
        } else {
          const terms = {
            Author: 'stelle__text__autor',
            Passage: 'stelle',
            Keyword: 'key_word',
            'Use Case': 'stelle__use_case',
            // Place: 'unused',
          };
          Object.keys(query).forEach((cat) => {
            if (query[cat] && cat !== 'time') {
              const arr = query[cat].split('+');
              arr.forEach((val) => {
                urls = urls.map((url) => `${url}&${terms[cat]}=${val}`);
              });
            }
          });

          if (query.time) {
            const startKey = this.$store.state.slider === 'passage' ? 'stelle__start_date' : 'stelle__text__not_before';
            const endKey = this.$store.state.slider === 'passage' ? 'stelle__end_date' : 'stelle__text__not_after';

            if (query.time.toString().includes('+')) {
              const times = query.time.split('+');
              urls = urls.map((url) => `${url}&${startKey}=${times[0]}&${startKey}_lookup=lt&${endKey}=${times[1]}&${endKey}_lookup=gt`);
            } else {
              urls = urls.map((url) => `${url}&${startKey}=${query.time - 5}&${startKey}_lookup=lt&${endKey}=${query.time + 4}&${endKey}_lookup=g`);
            }
          }
          if (query.Place) {
            console.log('place detected');
            urls.push(`https://mmp.acdh-dev.oeaw.ac.at/api/ort-geojson/?format=json&ids=${query.Place.split('+').join(',')}`);
          }
        }

        console.log('urls', urls);

        const prefetched = this.$store.state.fetchedResults[urls.toString()];
        if (prefetched) {
          this.entries = prefetched;
        } else {
          this.loading = true;
          Promise.all(urls.map((x) => fetch(x)))
            .then((res) => {
              Promise.all(res.map((x) => x.json()))
                .then((jsonRes) => {
                  console.log('map-data', jsonRes);
                  this.$store.commit('addToResults', { req: urls.toString(), res: jsonRes });
                  this.entries = jsonRes;
                })
                .catch((err) => {
                  console.error('err', err);
                })
                .finally(() => {
                  this.loading = false;
                });
            })
            .catch((err) => {
              console.error('err', err);
            });
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
