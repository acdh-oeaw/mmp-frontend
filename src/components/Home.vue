<template>
  <!-- eslint-disable-next-line vue/max-attributes-per-line -->
  <div>
    <v-parallax
      src="@/assets/europa.jpg"
      class="home-parallax text-center home-head"
      height="600"
    >
    <div class="parallax-wrapper">
      <v-row align="center" justify="center">
        <v-col cols="12">
          <span class="home-title text-h3 text-lg-h1 text-decoration-none">Mapping Medieval Peoples</span>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <p class="text-subtitle-1 font-weight-bold">
            {{ $t('subhead') }}
          </p>
          <p class="text-subtitle-1">
            {{ $t('subsubhead') }}
          </p>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="5" md="3" sm="5">
          <v-btn large block color="secondary" :to="{ name: $store.state.interface.currentView }">{{ $t('search') }}</v-btn>
          <span class="button-subtitle">
            {{ $t('analyses') }}
          </span>
        </v-col>
        <v-col cols="5" md="3" sm="5">
          <p>
            <v-btn large block color="primary" id="read" v-html="$t('read')" :to="{ name: 'Case Study', params: { id: 6 }}" />
            <span class="button-subtitle">
              {{ $t('casestudy') }}
            </span>
          </p>
        </v-col>
      </v-row>
    </div>
    </v-parallax>
    <case-study id="5"/>
  </div>
</template>

<script>
import CaseStudy from './CaseStudy';

export default {
  name: 'Home',
  components: {
    CaseStudy,
  },
};
</script>

<style lang="css">
  .button-subtitle {
    line-height: 40px;
    font-size: 1rem;
    vertical-align: top;
  }
  .home-content {
    margin-top: 50px;
  }
  .home-head div.v-parallax__content {
    background: linear-gradient(180deg, rgba(15, 18, 38, 1) 25%, rgba(15, 18, 38, 0.3) 100%);
    padding: 0;
  }
  span.home-title {
    text-decoration-line: underline;
    text-underline-offset: 3px;
    text-decoration-thickness: 3px;
    z-index: 100;
  }
  .study-surtitle {
    color: grey;
  }
</style>

<i18n>
{
  "en": {
    "subhead": "In the turbulent world of the early Middle Ages, ethnicity became a key resource in the reorganization of the political landscape. Mapping Medieval Peoples (MMP) proposes an innovative technical solution to analyze and visualize the ‘mental maps’ and the semantic fields that emerge from the analysis of late antique and early medieval source material.",
    "subsubhead": "We attempt to reconstruct ‘mental maps’ of a world of peoples, and will offer insights into the interplay between ethnonyms, religious terms, as well as attributes, traits and stereotypes, thus surveying the language employed to create ethnic entities and to distinguish them from each other.",
    "search": "Search our Data",
    "read": "Read &bdquo;Spain and the Bible&ldquo;",
    "analyses": "For Interactive Analyses",
    "casestudy": "A Case Study"
  }
}
</i18n>
