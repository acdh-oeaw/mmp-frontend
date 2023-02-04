import Vue from 'vue';
import VueRouter from 'vue-router';

import Browse from '@/components/browse.vue';
import CaseStudies from '@/components/case-studies.vue';
import CaseStudy from '@/components/case-study.vue';
import Explore from '@/components/explore.vue';
import GeoMap from '@/components/geo-map-wrapper.vue';
import Home from '@/components/home.vue';
import NetworkGraph from '@/components/network-graph-wrapper.vue';
import SearchResults from '@/components/search-results.vue';
import WordCloud from '@/components/word-cloud-wrapper.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/case-studies/',
    name: 'case-studies',
    component: CaseStudies,
  },
  {
    path: '/case-studies/:id',
    name: 'case-study',
    component: CaseStudy,
    // TODO:
    children: [
      {
        path: 'geo-map',
        name: 'geo-map',
        component: GeoMap,
      },
      {
        path: 'network-graph',
        name: 'network-graph',
        component: NetworkGraph,
      },
      {
        path: 'search-results',
        name: 'search-results',
        component: SearchResults,
      },
      {
        path: 'word-cloud',
        name: 'word-cloud',
        component: WordCloud,
      },
    ],
  },
  {
    path: '/explore/',
    name: 'explore',
    component: Explore,
    children: [
      {
        path: 'geo-map',
        name: 'geo-map',
        component: GeoMap,
      },
      {
        path: 'network-graph',
        name: 'network-graph',
        component: NetworkGraph,
      },
      {
        path: 'search-results',
        name: 'search-results',
        component: SearchResults,
      },
      {
        path: 'word-cloud',
        name: 'word-cloud',
        component: WordCloud,
      },
    ],
  },
  {
    path: '/browse/',
    name: 'browse',
    component: Browse,
    // TODO: child routes per entity type (?)
  },
];

export const router = new VueRouter({
  base: import.meta.env.BASE_URL,
  mode: 'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;

    if (to.hash) return { selector: to.hash };

    return { x: 0, y: 0 };
  },
});
