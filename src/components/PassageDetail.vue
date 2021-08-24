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
        <router-link :to="{ name: 'List', query: $route.query }" class="text-decoration-none">
          <v-icon>mdi-close</v-icon>
        </router-link>
      </v-list-item-action>
      <v-list-item-content v-if="true">
        <div v-if="!loading">
          <v-list-item-title class="text-h5">
            {{ title.title }}
          </v-list-item-title>
          <v-list-item-subtitle>
            <!-- this is a weird way to ensure the colon is only displayed when both these values have been loaded -->
            {{ [title.written, title.author].join(', ') }}
          </v-list-item-subtitle>
        </div>
        <v-skeleton-loader
          v-else
          type="heading, text"
        />
      </v-list-item-content>
    </v-list-item>
    <v-divider />
    <v-simple-table
      v-if="!loading"
      class="data-table"
    >
      <tbody>
        <tr v-for="item in items" :key="item.key">
          <td class="grey--text text--darken-1">
            {{ item.key }}
          </td>
          <td v-if="item.key === 'Keywords'">
            <div
              class="keyword-chip"
              v-for="keyword in item.value"
              :key="keyword.url"
            >
              <v-chip
                color="blue lighten-4"
                small
                @click="$store.commit('addToItemsAndInput', { id: keyword.url.replace(/\D/g, ''), selected_text: keyword.stichwort, group: 'Keyword' })"
              >
                {{ keyword.stichwort }}
              </v-chip>
            </div>
          </td>
          <td v-else-if="item.key === 'Author'">
            <div
              class="keyword-chip"
              v-for="author in item.value"
              :key="author.url"
            >
              <v-chip
                color="red lighten-3"
                small
                @click="$store.commit('addToItemsAndInput', { id: author.url.replace(/\D/g, ''), selected_text: author.name, group: 'Author' })"
              >
                {{ author.name_en }}
              </v-chip>
            </div>
          </td>
          <td v-else>
            {{ item.value }}
          </td>
        </tr>
      </tbody>
    </v-simple-table>
    <v-container v-else>
      <v-skeleton-loader
        type="table-row-divider@11"
      />
    </v-container>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'PassasgeDetail',
  data: () => ({
    headers: [
      { text: 'key', value: 'key' },
      { text: 'value', value: 'value' },
    ],
    items: [],
    loading: false,
    title: {
      title: null,
      written: null,
      author: null,
    },
  }),
  computed: {
    drawerWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
        case 'sm':
          return '100vw';
        case 'md':
          return '50vw';
        default:
          return '33vw';
      }
    },
  },
  watch: {
    '$route.params': {
      handler(params) {
        console.log(params);
        this.loading = true;

        const adress = `https://mmp.acdh-dev.oeaw.ac.at/api/stelle/${params.id}/?format=json`;
        const prefetched = this.$store.state.fetchedResults[adress];
        if (prefetched) {
          this.items = prefetched.results;
          this.pagination.count = prefetched.count;
        } else {
          fetch(adress)
            .then((res) => res.json())
            .then((res) => {
              console.log(res);

              this.title.title = res.text.title;
              this.title.written = (res.start_date || res.end_date) ? `${res.start_date || 'unknown'} - ${res.end_date || 'unknown'}` : 'unknown';
              this.title.author = res.text.autor.map((x) => x.name_en).join(', ');

              this.items = [
                {
                  key: 'Keywords',
                  value: res.key_word,
                },
                {
                  key: 'Quote',
                  value: res.zitat,
                },
                {
                  key: 'Title',
                  value: this.title.title,
                },
                {
                  key: 'Cited',
                  value: res.zitat_stelle,
                },
                {
                  key: 'Summary',
                  value: res.summary,
                },
                {
                  key: 'Author',
                  value: res.text.autor,
                },
                {
                  key: 'Place',
                  value: res.text.ort.map((x) => x.name).join(', '),
                },
                {
                  key: 'Edition',
                  value: res.text.edition,
                },
                {
                  key: 'Written',
                  value: this.title.written,
                },
                {
                  key: 'Translation',
                  value: res.translation,
                },
                {
                  key: 'Comment',
                  value: res.kommentar,
                },
              ];
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
<style>
</style>
