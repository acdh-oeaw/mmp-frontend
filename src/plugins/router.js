import Vue from 'vue';
import VueRouter from 'vue-router';

import AuthorDetail from '@/components/AuthorDetail.vue';
import CaseStudy from '@/components/CaseStudy.vue';
import CompareAuthors from '@/components/CompareAuthors.vue';
import Debug from '@/components/Debug.vue';
import FullscreenView from '@/components/FullscreenView.vue';
import GraphBeta from '@/components/GraphWrapperBeta.vue';
import Home from '@/components/Home.vue';
import Interface from '@/components/InterfaceWrapper.vue';
import KeywordDetail from '@/components/KeywordDetail.vue';
import List from '@/components/List.vue';
import ListAll from '@/components/ListAll.vue';
import Map from '@/components/MapWrapper.vue';
import PassageDetail from '@/components/PassageDetail.vue';
import PlaceDetail from '@/components/PlaceDetail.vue';
import SpatialDetail from '@/components/SpatialDetail.vue';
import Studies from '@/components/Studies.vue';
import WordCloudWrapper from '@/components/WordCloudWrapper.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/debug',
    name: 'Debug',
    component: Debug,
  },
  {
    path: '/studies/',
    name: 'Studies',
    component: Studies,
  },
  {
    path: '/studies/:id',
    name: 'Case Study',
    component: CaseStudy,
  },
  {
    path: '/explore/',
    name: 'Interface',
    component: Interface,
    children: [
      {
        path: 'map',
        name: 'Map',
        component: Map,
        children: [
          {
            path: 'spatial/:id',
            name: 'Spatial Detail',
            component: SpatialDetail,
          },
          {
            path: 'place/:id',
            name: 'Place Detail',
            component: PlaceDetail,
          },
        ],
      },
      {
        path: 'graph',
        name: 'Network Graph Beta',
        component: GraphBeta,
        children: [
          {
            path: 'detail/:id',
            name: 'Keyword Detail Beta',
            component: KeywordDetail,
          },
        ],
      },
      {
        path: 'compare',
        name: 'Compare Authors',
        component: CompareAuthors,
        children: [
          {
            path: 'detail/:id',
            name: 'Compare Authors Detail',
            component: KeywordDetail,
          },
          {
            path: 'author/:id',
            name: 'Compare Authors Author Detail',
            component: AuthorDetail,
          },
        ],
      },
      {
        path: 'list',
        name: 'List',
        component: List,
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
        path: 'cloud',
        name: 'Word Cloud',
        component: WordCloudWrapper,
      },
    ],
  },
  {
    path: '/list-all/',
    name: 'List All',
    component: ListAll,
  },
  {
    path: '/view/',
    name: 'View',
    component: FullscreenView,
    children: [
      {
        path: 'map',
        name: 'Map Fullscreen',
        component: Map,
        children: [
          {
            path: 'spatial/:id',
            name: 'Spatial Detail Fullscreen',
            component: SpatialDetail,
          },
          {
            path: 'place/:id',
            name: 'Place Detail Fullscreen',
            component: PlaceDetail,
          },
        ],
      },
      {
        path: 'graph',
        name: 'Network Graph Beta Fullscreen',
        component: GraphBeta,
        children: [
          {
            path: 'detail/:id',
            name: 'Keyword Detail Beta Fullscreen',
            component: KeywordDetail,
          },
        ],
      },
      {
        path: 'compare',
        name: 'Compare Authors Fullscreen',
        component: CompareAuthors,
        children: [
          {
            path: 'detail/:id',
            name: 'Compare Authors Detail Fullscreen',
            component: KeywordDetail,
          },
          {
            path: 'author/:id',
            name: 'Compare Authors Author Detail Fullscreen',
            component: AuthorDetail,
          },
        ],
      },
      {
        path: 'list',
        name: 'List Fullscreen',
        component: List,
        children: [
          {
            path: 'passage/:id',
            name: 'Passage Detail Fullscreen',
            component: PassageDetail,
          },
          {
            path: 'author/:id',
            name: 'Author Detail Fullscreen',
            component: AuthorDetail,
          },
        ],
      },
      {
        path: 'cloud',
        name: 'Word Cloud Fullscreen',
        component: WordCloudWrapper,
      },
    ],
  },
];

const router = new VueRouter({
  base: import.meta.env.BASE_URL,
  mode: 'hash',
  routes,
});

export default router;
