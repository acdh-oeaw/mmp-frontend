<script lang="ts" setup>
import { ref } from 'vue';

import Graph from '@/components/GraphWrapper.vue';
import List from '@/components/List.vue';
import MapWrapper from '@/components/MapWrapper.vue';
import WordCloudWrapper from '@/components/WordCloudWrapper.vue';

const passage = ref(0);
const place = ref(0);
const keyword = ref(0);
const usecase = ref(5);
const author = ref(0);
const show = ref({
  map: false,
  cloud: false,
  list: false,
  graph: true,
});

const renderKey = ref(0);
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field
          v-model="passage"
          label="Passage"
          type="number"
          min="0"
          @change="renderKey += 1"
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="place"
          label="Place"
          type="number"
          min="0"
          @change="renderKey += 1"
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="keyword"
          label="Keyword"
          type="number"
          min="0"
          @change="renderKey += 1"
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="usecase"
          label="Use Case"
          type="number"
          min="0"
          @change="renderKey += 1"
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="author"
          label="Author"
          type="number"
          min="0"
          @change="renderKey += 1"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-checkbox v-model="show.map" label="Map" />
      <map-wrapper
        v-if="show.map"
        :key="renderKey"
        :passage="passage"
        :place="place"
        :keyword="keyword"
        :usecase="usecase"
        :author="author"
      />
    </v-row>
    <v-row>
      <v-checkbox v-model="show.cloud" label="Cloud" />
      <word-cloud-wrapper
        v-if="show.cloud"
        :key="renderKey"
        :passage="passage"
        :place="place"
        :keyword="keyword"
        :usecase="usecase"
        :author="author"
      />
    </v-row>
    <v-row>
      <v-checkbox v-model="show.list" label="List" />
      <list
        v-if="show.list"
        :key="renderKey"
        :passage="passage"
        :place="place"
        :keyword="keyword"
        :usecase="usecase"
        :author="author"
      />
    </v-row>
    <v-row>
      <v-checkbox v-model="show.graph" label="Graph" />
      <graph
        v-if="show.graph"
        :key="renderKey"
        :passage="passage"
        :place="place"
        :keyword="keyword"
        :usecase="usecase"
        :author="author"
      />
    </v-row>
  </v-container>
</template>
