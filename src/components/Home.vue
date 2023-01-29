<script lang="ts" setup>
import { useRoute } from 'vue-router/composables';

import bgImage from '@/assets/europa.jpg';
import CaseStudy from '@/components/CaseStudy.vue';
import { useStore } from '@/lib/use-store';

const route = useRoute();
const store = useStore();

const caseStudyId = 4;
</script>

<template>
  <div>
    <v-parallax :src="bgImage" class="home-parallax text-center home-head">
      <div class="parallax-wrapper">
        <v-container>
          <v-row align="center" justify="center">
            <v-col cols="12">
              <span class="home-title text-h3 text-lg-h1 text-decoration-none">
                Mapping Medieval Peoples
              </span>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="12" lg="8">
              <p class="text-subtitle-1 font-weight-bold">
                In the turbulent world of the early Middle Ages, ethnicity became a key resource in
                the reorganization of the political landscape. Mapping Medieval Peoples (MMP)
                proposes an innovative technical solution to analyze and visualize the "mental maps"
                and the semantic fields that emerge from the analysis of late antique and early
                medieval source material.
              </p>
              <p class="text-subtitle-1">
                We attempt to reconstruct "mental maps" of a world of peoples, and will offer
                insights into the interplay between ethnonyms, religious terms, as well as
                attributes, traits and stereotypes, thus surveying the language employed to create
                ethnic entities and to distinguish them from each other.
              </p>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="12" lg="3" sm="5">
              <v-btn
                large
                block
                color="secondary"
                :to="{ name: store.state.interface.currentView, query: route.query }"
                >Search our Data</v-btn
              >
              <span class="button-subtitle">For Interactive Analyses</span>
            </v-col>
            <v-col cols="12" lg="3" sm="5">
              <p>
                <v-btn
                  large
                  block
                  color="primary"
                  :to="{ name: 'Case Study', params: { id: 4 }, query: route.query }"
                >
                  Read &bdquo;Carolingian Avaria&ldquo;
                </v-btn>
                <span class="button-subtitle">A Case Study</span>
              </p>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-parallax>
    <case-study :id="caseStudyId" />
  </div>
</template>

<style>
.button-subtitle {
  line-height: 40px;
  font-size: 1rem;
  vertical-align: top;
}

.home-content {
  margin-top: 50px;
}

.home-head {
  min-height: 600px;
  height: unset !important;
}

.home-head div.v-parallax__content {
  background: linear-gradient(180deg, rgb(15 18 38 / 100%) 25%, rgb(15 18 38 / 30%) 100%);
  padding: 0;
  min-height: 600px;
}

span.home-title {
  text-decoration-line: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 3px;
  z-index: 100;
}
</style>
