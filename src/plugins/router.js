import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '@/components/Home';
import Interface from '@/components/InterfaceWrapper';
import Studies from '@/components/Studies';
import CaseStudy from '@/components/CaseStudy';
import Graph from '@/components/Graph';
import Map from '@/components/MapWrapper';
import List from '@/components/List';

import KeywordDetail from '@/components/KeywordDetail';
import PassageDetail from '@/components/PassageDetail';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
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
        path: 'list',
        name: 'List',
        component: List,
        children: [
          {
            path: 'detail/:id',
            name: 'Passage Detail',
            component: PassageDetail,
          },
        ],
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
