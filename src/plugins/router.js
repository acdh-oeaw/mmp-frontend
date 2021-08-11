import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '@/components/Home';
import Interface from '@/components/InterfaceWrapper';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/explore/',
    name: 'Interface',
    component: Interface,
    children: [
      {
        path: 'graph/:query?',
        name: 'Graph',
      },
      {
        path: 'map/:query?',
        name: 'Map',
      },
      {
        path: 'list/:query?',
        name: 'List',
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
