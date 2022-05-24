import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '@/components/Home';
import Interface from '@/components/InterfaceWrapper';
import Studies from '@/components/Studies';
import CaseStudy from '@/components/CaseStudy';
import Graph from '@/components/GraphWrapper';
import GraphBeta from '@/components/GraphWrapperBeta';
import Map from '@/components/MapWrapper';
import List from '@/components/List';
import WordCloudWrapper from '@/components/WordCloudWrapper';
import ListAll from '@/components/ListAll';
import FullscreenView from '@/components/FullscreenView';

import KeywordDetail from '@/components/KeywordDetail';
import PassageDetail from '@/components/PassageDetail';
import PlaceDetail from '@/components/PlaceDetail';
import SpatialDetail from '@/components/SpatialDetail';
import AuthorDetail from '@/components/AuthorDetail';

import Debug from '@/components/Debug';

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
        name: 'Network Graph',
        component: Graph,
        children: [
          {
            path: 'detail/:id',
            name: 'Keyword Detail',
            component: KeywordDetail,
          },
        ],
      },
      {
        path: 'graph-beta',
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
        name: 'Network Graph Fullscreen',
        component: Graph,
        children: [
          {
            path: 'detail/:id',
            name: 'Keyword Detail Fullscreen',
            component: KeywordDetail,
          },
        ],
      },
      {
        path: 'graph-beta',
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
  routes,
});

export default router;
