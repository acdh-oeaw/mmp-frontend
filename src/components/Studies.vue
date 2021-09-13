<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" xl="8">
        <v-card
          class="study-card"
          v-for="study in studies"
          :key="study.url"
        >
          <v-card-title>{{ study.title }}</v-card-title>
          <v-card-subtitle v-if="study.principal_investigator">{{ study.principal_investigator }}</v-card-subtitle>
          <v-card-text v-if="study.description">{{ study.description }}</v-card-text>
          <v-card-actions>
            <v-btn
              text
              :to="{ name: 'Case Study', params: { id: getIdFromUrl(study.url) }}"
            >
              Read More
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Studies',
  data: () => ({
    studies: [],
  }),
  methods: {
    getIdFromUrl: (url) => url.replace(/\D/g, ''),
  },
  mounted() {
    fetch('https://mmp.acdh-dev.oeaw.ac.at/api/usecase/?format=json')
      .then((res) => res.json())
      .then((res) => {
        console.log('studies', res);
        this.studies = res.results;
      });
  },
};
</script>
<style scoped>
  .study-card {
    margin-bottom: 20px;
  }
</style>
