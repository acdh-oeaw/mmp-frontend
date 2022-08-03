<template>
  <v-navigation-drawer permanent fixed right color="#F1F5FA" :width="drawerWidth">
    <v-list-item>
      <v-list-item-action>
        <router-link :to="{ name: fullscreen ? 'List Fullscreen' : 'List', query: $route.query }"
          class="text-decoration-none">
          <v-icon>mdi-close</v-icon>
        </router-link>
      </v-list-item-action>
      <v-list-item-content>
        <div v-if="!loading">
          <v-list-item-title class="text-h5">
            {{ getOptimalName(data) }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ data.jahrhundert || 'unknown century' }}, {{ getOptimalName(data.ort) || 'unknown place' }}
          </v-list-item-subtitle>
          <v-list-item-subtitle v-if="data.gnd_id">
            GND-ID: <a :href="'https://d-nb.info/gnd/' + data.gnd_id.replace(/\D/g, '')" target="_blank">{{
            data.gnd_id.replace(/\D/g, '')}} <v-icon small>mdi-open-in-new</v-icon></a>
          </v-list-item-subtitle>
        </div>
        <v-skeleton-loader v-else type="heading, text@2" />
      </v-list-item-content>
    </v-list-item>
    <v-divider />
    <v-container>
      <div class="keyword-chip" v-for="keyword in keywords.results" :key="keyword.url">
        <v-chip :color="keyColors.chips[keyword.art]" small
          @click="$store.commit('addToItemsAndInput', { id: keyword.url.replace(/\D/g, ''), selected_text: keyword.stichwort, group: 'Keyword' })">
          {{ keyword.stichwort }}
        </v-chip>
      </div>
      <v-expansion-panels :value="[0, 1]" flat accordion multiple>
        <v-expansion-panel :disabled="!loading && !usecases.count">
          <v-expansion-panel-header>
            Use Cases
            <template v-slot:actions>
              <v-chip small :disabled="!usecases.count" color="amber lighten-3">{{ usecases.count }}</v-chip>
              <v-icon>mdi-chevron-down</v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list v-if="!loading">
              <v-list-item v-for="usecase in usecases.results" three-line :key="usecase.url" :to="{
                name: 'Case Study',
                params: { id: getIdFromUrl(usecase.url) },
                query: addParamsToQuery()
              }">
                <v-list-item-content>
                  <v-list-item-title>
                    {{ usecase.title }}
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="usecase.principal_investigator">
                    {{ usecase.principal_investigator }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-if="usecase.description">
                    {{ usecase.description }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-icon>
                  <v-icon>mdi-chevron-right</v-icon>
                </v-list-item-icon>
              </v-list-item>
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
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel :disabled="!loading && !passages.count">
          <v-expansion-panel-header>
            Passages
            <template v-slot:actions>
              <v-chip small :disabled="!passages.count" color="teal lighten-4">{{ passages.count }}</v-chip>
              <v-icon>mdi-chevron-down</v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list v-if="!loading">
              <v-list-item v-for="passage in passages.results" three-line :key="passage.url" :to="{
              name: fullscreen ? 'Passage Detail Fullscreen' : 'Passage Detail',
              query: addParamsToQuery({ Passage: getIdFromUrl(passage.url) }),
              params: { id: getIdFromUrl(passage.url) }}">
                <v-list-item-content>
                  <v-list-item-title>
                    {{ passage.display_label }}
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="passage.text.autor.length">
                    {{ passage.text.title }}, {{ passage.text.autor.map((x) => getOptimalName(x)).join(', ') }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-if="passage.text.jahrhundert">
                    {{ passage.text.jahrhundert }} century
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-icon>
                  <v-icon>mdi-chevron-right</v-icon>
                </v-list-item-icon>
              </v-list-item>
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
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
  </v-navigation-drawer>
</template>
<script>
import helpers from '@/helpers';

export default {
  name: 'AuthorDetail',
  data: () => ({
    loading: true,
    data: {},
    usecases: [],
    passages: [],
    keywords: {},
  }),
  mixins: [helpers],
  watch: {
    '$route.params': {
      handler(params) {
        console.log('params', params);
        this.loading = true;

        const urls = [
          `https://mmp.acdh-dev.oeaw.ac.at/api/autor/${params.id}/?format=json`,
          `https://mmp.acdh-dev.oeaw.ac.at/api/usecase/?has_stelle__text__autor=${params.id}&format=json`,
          `https://mmp.acdh-dev.oeaw.ac.at/api/stelle/?text__autor=${params.id}&format=json&has_usecase=${this.hasUsecase}`,
          `https://mmp.acdh-dev.oeaw.ac.at/api/keyword/?rvn_stelle_key_word_keyword__text__autor=${params.id}&format=json&has_usecase=${this.hasUsecase}`,
        ];
        const prefetched = this.$store.state.fetchedResults[urls.toString()];

        if (prefetched) {
          console.log('author prefetched', prefetched);
          [this.data, this.usecases, this.passages] = prefetched;
          this.loading = false;
        } else {
          Promise.all(urls.map((x) => fetch(x)))
            .then((res) => {
              Promise.all(res.map((x) => x.json()))
                .then((jsonRes) => {
                  console.log('author res', jsonRes);
                  this.$store.commit('addToResults', { req: urls.toString(), res: jsonRes });
                  [this.data, this.usecases, this.passages, this.keywords] = jsonRes;
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
