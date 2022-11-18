<template>
  <v-card color="transparent" width="100%" flat>
    <v-data-table
      :items="items"
      :headers="headers"
      :loading="loading"
      :server-items-length="pagination.count"
      disable-sort
      disable-filtering
      no-data-text="No passages found"
      @update:page="updateOffset"
      @update:items-per-page="updateLimit"
      :footer-props="{
        'items-per-page-options': [10, 20, 50, 100, 1000, -1],
      }"
      class="data-table"
    >
      <template v-slot:[`item.text.autor`]="{ item }">
        <template v-if="item.text">
          <router-link
            v-for="(author, i) in item.text.autor"
            :to="{
              name: fullscreen ? 'Author Detail Fullscreen' : 'Author Detail',
              params: { id: author.id },
              query: $route.query,
            }"
            :key="author.id"
            class="text-decoration-none"
          >
            <span v-if="i != 0">, </span>
            {{ getOptimalName(author) }}
            <v-icon>mdi-chevron-right</v-icon>
          </router-link>
        </template>
      </template>
      <template v-slot:[`item.text.title`]="{ item }">
        <template v-if="item.text">
          <router-link
            :to="{
              name: fullscreen ? 'Passage Detail Fullscreen' : 'Passage Detail',
              params: { id: item.id },
              query: $route.query,
            }"
            class="text-decoration-none"
          >
            <b>{{ item.text.title }}</b
            ><v-icon>mdi-chevron-right</v-icon>
          </router-link>
        </template>
      </template>
      <template v-slot:[`item.keywords`]="{ item }">
        <div class="keyword-chip" v-for="keyword in item.key_word" :key="keyword.stichwort">
          <v-chip small :color="keyColors.chips[keyword.art]" @click="addKeywordToInput(keyword)">
            {{ keyword.stichwort }}
          </v-chip>
        </div>
      </template>
      <template v-slot:[`item.written`]="{ item }">
        <!-- displays unkown if neither start nor end date are defined -->
        {{ item.text ? displayTimeRange(item.text.start_date, item.text.end_date) : 'unknown' }}
      </template>
      <template v-slot:[`item.coverage`]="{ item }">
        <!-- displays nothing if neither start nor end date are defined -->
        {{ displayTimeRange(item.start_date, item.end_date) }}
      </template>
      <template v-slot:[`footer.prepend`]>
        <fullscreen-button left />
      </template>
    </v-data-table>
    <router-view />
  </v-card>
</template>

<script>
import helpers from '@/helpers';
import FullscreenButton from './FullscreenButton';

export default {
  components: { FullscreenButton },
  name: 'List',
  data: () => ({
    headers: [
      { text: 'Author', value: 'text.autor', width: '150px' },
      { text: 'Title', value: 'text.title' },
      { text: 'Label', value: 'display_label' },
      { text: 'Keywords', value: 'keywords' },
      { text: 'Time Frame', value: 'written', width: '100px' },
      { text: 'Coverage', value: 'coverage', width: '100px' },
    ],
    items: [],
    loading: false,
    pagination: {
      count: 0,
      limit: 10,
      offset: 0,
    },
    renderKey: 0,
  }),
  mixins: [helpers],
  props: ['keyword', 'passage', 'author', 'usecase', 'place'],
  methods: {
    addKeywordToInput(obj) {
      this.$store.commit('addToItemsAndInput', {
        id: obj.id,
        selected_text: obj.stichwort,
        group: 'Keyword',
      });
    },
    addAuthorToInput(obj) {
      console.log(obj);
      this.$store.commit('addToItemsAndInput', {
        id: obj.id,
        selected_text: obj.name,
        group: 'Author',
      });
    },
    fetchList(query) {
      const terms = {
        Author: this.$store.state.apiParams.intersect ? 'text__autor' : 'text__autor_and',
        // Passage: 'id', // not used anymore
        Keyword: this.$store.state.apiParams.intersect ? 'key_word' : 'key_word_and',
        'Use Case': 'use_case',
        Place: 'text__ort',
      };

      let address = `${process.env.VUE_APP_MMP_API_BASE_URL}/api/stelle/?format=json&limit=${this.pagination.limit}&offset=${this.pagination.offset}&has_usecase=${this.hasUsecase}`;
      const props = [this.author, this.passage, this.keyword, this.usecase, this.place];

      if (props.some((x) => x)) {
        console.debug('list props detected!', props);
        let j;
        props.forEach((prop, i) => {
          if (prop && prop !== '0') {
            console.debug('list prop', prop);
            if (i === 1) {
              // passage
              address += `&ids=${prop.toString().split('+').join(',')}`;
            } else {
              if (i > 1) j = i - 1; // because terms is missing an element
              else j = i;
              address += `&${terms[Object.keys(terms)[j]]}=${prop}`;
            }
          }
        });
      } else {
        Object.keys(query).forEach((cat) => {
          if (query[cat] && cat !== 'time') {
            console.log(query[cat]);
            const arr = query[cat].toString(10).split('+');
            arr.forEach((val) => {
              address += `&${terms[cat]}=${val}`;
            });
          }
        });

        if (query.Passage) address += `&ids=${query.Passage.toString().replaceAll('+', ',')}`;

        if (query.time) {
          const key = this.$store.state.slider === 'passage' ? '' : 'text__';
          if (query.time.toString().includes('+')) {
            const times = query.time.split('+');
            address += `&${key}start_date=${times[0]}&${key}start_date_lookup=gt`;
            address += `&${key}end_date=${times[1]}&${key}end_date_lookup=lt`;
          } else {
            address += `&${key}start_date=${query.time - 5}&${key}start_date_lookup=gt`;
            address += `&${key}end_date=${query.time + 4}&${key}end_date_lookup=lt`;
          }
        }
      }

      console.log('address', address);

      const prefetched = this.$store.state.fetchedResults[address];
      if (prefetched) {
        this.items = prefetched.results;
        this.pagination.count = prefetched.count;
      } else {
        this.loading = true;
        fetch(address)
          .then((res) => res.json())
          .then((res) => {
            console.log('list-data', res);
            this.$store.commit('addToResults', { req: address, res });
            this.items = res.results;
            this.pagination.count = res.count;
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    updateLimit(limit) {
      this.pagination.limit = limit === -1 ? this.pagination.count : limit;
      this.fetchList(this.$route.query);
    },
    updateOffset(page) {
      this.pagination.offset = (page - 1) * this.pagination.limit;
      this.fetchList(this.$route.query);
    },
  },
  watch: {
    '$route.query': {
      handler(query) {
        this.fetchList(query);
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style>
a:hover {
  text-decoration: underline;
}
div.v-data-table.data-table {
  background-color: transparent;
}
.keyword-chip {
  display: inline-block;
  margin: 1.5px;
}
</style>
