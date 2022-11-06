<template>
  <v-container>
    <v-row>
      <v-col offset="0" offset-lg="4" cols="12" lg="6">
        <v-autocomplete
          v-model="studyAuto"
          color="primary"
          placeholder="Search for case studies by authors or keywords"
          multiple
          return-object
          no-filter
          chips
          deletable-chips
          autofocus
          auto-select-first
          item-text="selected_text"
          no-data-text="No data found"
          ref="case-autocomplete"
          :items="studySearch"
          :search-input.sync="textInput"
          @change="textInput = ''"
          @keyup.enter="pushQuery"
          :loading="loading"
        >
          <template v-slot:item="data">
            <v-list-item-content v-if="data.item.group === 'Keyword' && data.item.selected_text.includes(',')">
              <v-list-item-title>
                {{ removeRoot(data.item.selected_text) }}
                <span v-if="$store.state.completeKeywords.includes(parseInt(data.item.id))">(complete)</span>
              </v-list-item-title>
              <v-list-item-subtitle>Keyword ({{ data.item.selected_text.split(',')[1].replace(/\W/g, '') }})
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-content v-else>
              <v-list-item-title>{{ data.item.selected_text }}</v-list-item-title>
              <v-list-item-subtitle>{{ data.item.group }}</v-list-item-subtitle>
            </v-list-item-content>
          </template>
          <template v-slot:append>
            <v-icon
              color="primary"
              @click="studyAuto = []"
              v-if="studyAuto.length"
            >mdi-close</v-icon>
          </template>
        </v-autocomplete>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" lg="8">
        <v-card class="study-card" v-for="study in studies" :key="study.url">
          <v-card-title>{{ study.title }}</v-card-title>
          <v-card-subtitle v-if="study.principal_investigator">{{ study.principal_investigator }}</v-card-subtitle>
          <v-card-text v-if="study.description">{{ study.description }}</v-card-text>
          <v-card-actions>
            <v-btn text :to="{ name: 'Case Study', params: { id: getIdFromUrl(study.url), query: addParamsToQuery() }}">
              Read More
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import helpers from '@/helpers';

export default {
  name: 'Studies',
  data: () => ({
    studies: [],
    studySearch: [],
    studyAuto: [],
    textInput: '',
    loading: false,
  }),
  mixins: [helpers],
  watch: {
    textInput(val) {
      if (!val || val.length < 1) return;
      const urls = {};
      const filters = this.$store.state.searchFilters;
      if (filters.author) urls.Author = `${process.env.VUE_APP_MMP_API_BASE_URL}/archiv-ac/autor-autocomplete/?q=${val}`;
      if (Object.values(filters.keyword).some((x) => x)) urls.Keyword = `${process.env.VUE_APP_MMP_API_BASE_URL}/archiv-ac/keyword-autocomplete/?q=${val}`;

      // const labels = ['Author', 'Keyword'];
      const prefetched = this.$store.state.fetchedResults[JSON.stringify(urls)];

      if (prefetched) {
        this.studySearch = [];
        prefetched.forEach((x, i) => {
          this.studySearch = [...this.studySearch, ...(x.results.map((result) => ({ ...result, type: ['author', 'keyword'][i] })))];
        });
      } else {
        this.loading = true;
        Promise.all(Object.values(urls).map((x) => fetch(x)))
          .then((res) => {
            Promise.all(res.map((x) => x.json()))
              .then((jsonRes) => {
                console.log('promise all autocomplete studies', jsonRes);
                this.$store.commit('addToResults', { req: JSON.stringify(urls), res: jsonRes });
                console.log('urls', urls);
                this.studySearch = [];
                jsonRes.forEach((x, i) => {
                  this.studySearch = [...this.studySearch, ...(x.results.map((result) => ({ ...result, type: ['author', 'keyword'][i] })))];
                });
              })
              .catch((err) => {
                console.error(err);
              })
              .finally(() => {
                this.loading = false;
              });
          })
          .catch((err) => {
            this.loading = false;
            console.error(err);
          });
      }
    },
    studyAuto: {
      handler(val) {
        console.log('studyAuto', val);
        let url = `${process.env.VUE_APP_MMP_API_BASE_URL}/api/usecase/?format=json`;
        const apiParams = {
          author: 'has_stelle__text__autor',
          keyword: 'has_stelle__key_word',
        };
        val.forEach((value) => {
          url += `&${apiParams[value.type]}=${value.id}`;
        });
        console.log('study url', url);

        const prefetched = this.$store.state.fetchedResults[url];
        if (prefetched) {
          this.studies = prefetched.results;
        } else {
          fetch(url)
            .then((res) => res.json())
            .then((res) => {
              console.log('studies', res);
              this.$store.commit('addToResults', { req: url, res });
              this.studies = res.results;
            });
        }
      },
      deep: true,
    },
  },
  mounted() {
    const address = `${process.env.VUE_APP_MMP_API_BASE_URL}/api/usecase/?format=json`;
    const prefetched = this.$store.state.fetchedResults[address];

    if (prefetched) {
      this.studies = prefetched.results;
    } else {
      fetch(address)
        .then((res) => res.json())
        .then((res) => {
          console.log('studies', res);
          this.$store.commit('addToResults', { req: address, res });
          this.studies = res.results;
        });
    }
  },
};
</script>
<style scoped>
  .study-card {
    margin-bottom: 20px;
  }
</style>
