<template>
  <v-card
    color="transparent"
    width="100%"
    class="map-wrapper"
  >
    <leaflet :data="entries" :loading="loading" />
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
  </v-card>
</template>

<script>
import Leaflet from './Leaflet';

export default {
  name: 'Map',
  components: {
    Leaflet,
  },
  data: () => ({
    entries: null,
    loading: false,
  }),
  watch: {
    '$route.query': {
      handler(query) {
        const terms = {
          Author: 'stelle__text__autor',
          Passage: 'stelle',
          Keyword: 'key_word',
          // 'Use Case': 'unused',
          // Place: 'unused',
        };
        let address = 'https://mmp.acdh-dev.oeaw.ac.at/api/spatialcoverage/?format=json';
        Object.keys(query).forEach((cat) => {
          if (query[cat]) {
            const arr = query[cat].split('+');
            arr.forEach((val) => {
              address += `&${terms[cat]}=${val}`;
            });
          }
        });

        if (query.time) {
          const startKey = this.$store.state.slider === 'passage' ? 'stelle__start_date' : 'stelle__text__not_before';
          const endKey = this.$store.state.slider === 'passage' ? 'stelle__end_date' : 'stelle__text__not_after';

          if (query.time.toString().includes('+')) {
            const times = query.time.split('+');
            address += `&${startKey}=${times[0]}&${startKey}_lookup=lt`;
            address += `&${endKey}=${times[1]}&${endKey}_lookup=gt`;
          } else {
            address += `&${startKey}=${query.time - 5}&${startKey}_lookup=lt`;
            address += `&${endKey}=${query.time + 4}&${endKey}_lookup=gt`;
          }
        }
        console.log('address', address);

        const prefetched = this.$store.state.fetchedResults[address];
        if (prefetched) {
          this.entries = prefetched;
        } else {
          this.loading = true;
          fetch(address)
            .then((res) => res.json())
            .then((res) => {
              console.log('map-data', res);
              this.$store.commit('addToResults', { req: address, res });
              this.entries = res;
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => {
              this.loading = false;
            });
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style scoped>
  .map-wrapper {
    z-index: 0;
  }
</style>
