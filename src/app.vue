<script lang="ts" setup>
import AppBar from '@/components/app-bar.vue';
import DetailPanel from '@/components/detail-panel.vue';
import { useHomePage } from '@/lib/use-home-page';
import { useVuetify } from '@/lib/use-vuetify';

const isHomePage = useHomePage();
const vuetify = useVuetify();
</script>

<template>
	<VApp class="app">
		<DetailPanel />

		<AppBar />
		<div class="buffer" :class="{ light: !isHomePage, smaller: vuetify.breakpoint.mobile }" />

		<VMain>
			<RouterView />
		</VMain>
	</VApp>
</template>

<style>
a {
	text-decoration: none !important;
}

.v-card__title {
	word-break: keep-all !important;
}

.app {
	background-color: #f1f5fa !important;
}

.buffer {
	background-color: #0f1226;
	height: 140px;
}

.buffer.smaller {
	height: 130px;
}

.buffer.light {
	background: unset;
}
</style>
