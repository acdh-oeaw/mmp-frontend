import Vue from 'vue';
import VueRouter from 'vue-router';

import AuthorDetail from '@/components/author-detail.vue';
import CaseStudies from '@/components/case-studies.vue';
import CaseStudy from '@/components/case-study.vue';
import EntitiesList from '@/components/entities-list.vue';
import Explore from '@/components/explore.vue';
import GeoMap from '@/components/geo-map-wrapper.vue';
import Home from '@/components/home.vue';
import KeywordDetail from '@/components/keyword-detail.vue';
import NetworkGraph from '@/components/network-graph-wrapper.vue';
import PassageDetail from '@/components/passage-detail.vue';
import PlaceDetail from '@/components/place-detail.vue';
import SearchResults from '@/components/search-results.vue';
import SpatialCoverageDetail from '@/components/spatial-coverage-detail.vue';
import WordCloud from '@/components/word-cloud-wrapper.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/case-studies/',
    name: 'Case Studies',
    component: CaseStudies,
  },
  {
    path: '/case-studies/:id',
    name: 'Case Study',
    component: CaseStudy,
  },
  {
    path: '/explore/',
    name: 'Interface',
    component: Explore,
    children: [
      {
        path: 'geo-map',
        name: 'Map',
        component: GeoMap,
        children: [
          {
            path: 'spatial-coverage/:id',
            name: 'Spatial Detail',
            component: SpatialCoverageDetail,
          },
          {
            path: 'place/:id',
            name: 'Place Detail',
            component: PlaceDetail,
          },
        ],
      },
      {
        path: 'network-graph',
        name: 'Network Graph',
        component: NetworkGraph,
        children: [
          {
            path: 'detail/:id',
            name: 'Keyword Detail',
            component: KeywordDetail,
          },
          {
            path: 'author/:id',
            name: 'Graph Author Detail',
            component: AuthorDetail,
          },
        ],
      },
      {
        path: 'search-results',
        name: 'List',
        component: SearchResults,
        children: [
          {
            path: 'passage/:id',
            name: 'Passage Detail',
            component: PassageDetail,
          },
          {
            path: 'author/:id',
            name: 'Author Detail',
            component: AuthorDetail,
          },
        ],
      },
      {
        path: 'word-cloud',
        name: 'Word Cloud',
        component: WordCloud,
      },
    ],
  },
  {
    path: '/entities/',
    name: 'List All',
    component: EntitiesList,
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
