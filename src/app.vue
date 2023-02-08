<script lang="ts" setup>
import AppBar from '@/components/app-bar.vue';
import DetailPanel from '@/components/detail-panel.vue';
</script>

<template>
	<VApp class="app">
		<DetailPanel />
		<AppBar />
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
