<template>
  <v-app class="app-class">
    <template v-if="!isFullScreen">
      <app-bar />
      <div
        class="buffer"
        :class="{ light: $route.name !== 'Home', smaller: $vuetify.breakpoint.mobile }"
      />
    </template>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import AppBar from '@/components/AppBar';
import helpers from '@/helpers';

export default {
  name: 'App',
  components: {
    AppBar,
  },
  mixins: [helpers],
  data: () => ({}),
  created() {
    const dictRev = {
      searchAuthors: 'author',
      searchPassages: 'passage',
      searchUsecases: 'usecase',
    };
    const keyDictRev = {
      searchEthnonyms: 'ethnonym',
      searchNames: 'name',
      searchPhrases: 'phrase',
      searchRegions: 'region',
    };
    const placeDictRev = {
      searchPlaceAuthors: 'author',
      searchPlacePassages: 'passage',
      searchPlaceTexts: 'text',
    };
    const query = Object.entries(this.$route.query);
    query.forEach(([key, val]) => {
      if (dictRev[key]) {
        this.$store.commit('setFilter', { cat: dictRev[key], val: val === 'true' }); // val === 'true' converts booleanlike strings to booleans
      } else if (keyDictRev[key]) {
        this.$store.commit('setSpecificSubFilter', {
          cat: 'keyword',
          key: keyDictRev[key],
          val: val === 'true',
        });
      } else if (placeDictRev[key]) {
        this.$store.commit('setSpecificSubFilter', {
          cat: 'place',
          key: placeDictRev[key],
          val: val === 'true',
        });
      } else if (['hasUsecase', 'slider', 'intersection'].includes(key)) {
        this.$store.commit('setApiParam', { key, val });
      }
    });
  },
};
</script>

<style>
a {
  text-decoration: none !important;
}

.v-card__title {
  word-break: keep-all !important;
}

.app-class {
  background-color: #f1f5fa !important;
}

.buffer {
  background-color: #0f1226;
  height: 140px;
}

.buffer.smaller {
  height: 130px;
}

.buffer.light {
  background: unset;
}
</style>
