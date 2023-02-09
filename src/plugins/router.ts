import Vue from 'vue';
import VueRouter from 'vue-router';

import Browse from '@/components/browse.vue';
import CaseStudy from '@/components/case-study.vue';
import About from '@/pages/about.vue';
import CaseStudyTextsByAuthors from '@/pages/case-studies/[id]/authors.vue';
import CaseStudyGeoMap from '@/pages/case-studies/[id]/geo-map.vue';
import CaseStudyNetworkGraph from '@/pages/case-studies/[id]/network-graph.vue';
import CaseStudyStory from '@/pages/case-studies/[id]/story.vue';
import CaseStudyTimeline from '@/pages/case-studies/[id]/timeline.vue';
import CaseStudyWordCloud from '@/pages/case-studies/[id]/word-cloud.vue';
import CaseStudies from '@/pages/case-studies/index.vue';
import Explore from '@/pages/explore.vue';
import ExploreGeoMap from '@/pages/explore/geo-map.vue';
import ExploreNetworkGraph from '@/pages/explore/network-graph.vue';
import ExploreSearchResults from '@/pages/explore/search-results.vue';
import ExploreWordCloud from '@/pages/explore/word-cloud.vue';
import Imprint from '@/pages/imprint.vue';
import Home from '@/pages/index.vue';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'home',
		component: Home,
	},
	{
		path: '/about',
		name: 'about',
		component: About,
	},
	{
		path: '/imprint',
		name: 'imprint',
		component: Imprint,
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
		children: [
			{
				path: 'timeline',
				name: 'case-study-timeline',
				component: CaseStudyTimeline,
			},
			{
				path: 'story',
				name: 'case-study-story',
				component: CaseStudyStory,
			},
			{
				path: 'network-graph',
				name: 'case-study-network-graph',
				component: CaseStudyNetworkGraph,
			},
			{
				path: 'geo-map',
				name: 'case-study-geo-map',
				component: CaseStudyGeoMap,
			},
			{
				path: 'word-cloud',
				name: 'case-study-word-cloud',
				component: CaseStudyWordCloud,
			},
			{
				path: 'authors',
				name: 'case-study-texts-by-authors',
				component: CaseStudyTextsByAuthors,
			},
		],
	},
	{
		path: '/explore/',
		name: 'explore',
		component: Explore,
		children: [
			{
				path: 'search-results',
				name: 'explore-search-results',
				component: ExploreSearchResults,
			},
			{
				path: 'network-graph',
				name: 'explore-network-graph',
				component: ExploreNetworkGraph,
			},
			{
				path: 'geo-map',
				name: 'explore-geo-map',
				component: ExploreGeoMap,
			},
			{
				path: 'word-cloud',
				name: 'explore-word-cloud',
				component: ExploreWordCloud,
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
