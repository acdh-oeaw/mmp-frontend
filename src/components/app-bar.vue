<script lang="ts" setup>
import { computed, ref } from 'vue';

import MobileNavigationPanel from '@/components/mobile-navigation-panel.vue';
import { useHomePage } from '@/lib/use-home-page';

const isHomePage = useHomePage();
const backgroundColor = computed(() => {
	return isHomePage.value ? 'primary' : 'background';
});

const isPanelOpen = ref(false);

function onTogglePanel() {
	isPanelOpen.value = !isPanelOpen.value;
}

const links = {
	about: { name: 'about', label: 'About the Project' },
	'case-studies': { name: 'case-studies', label: 'Case Studies' },
	explore: { name: 'explore-search-results', label: 'Explore the Data' },
};
</script>

<template>
	<div>
		<VAppBar class="app-bar" :color="backgroundColor" fixed flat min-height="84px" shrink-on-scroll>
			<VRow justify="center">
				<VCol cols="12" md="2" class="title-wrapper">
					<VAppBarNavIcon
						class="d-inline d-md-none menu-button"
						:class="{ 'white--text': isHomePage }"
						@click.stop="onTogglePanel"
					/>
					<VToolbarTitle class="d-inline font-display font-weight-bold text-decoration-none">
						<RouterLink :to="{ name: 'home' }" class="nav-link" :class="{ light: !isHomePage }">
							MMP
						</RouterLink>
					</VToolbarTitle>
				</VCol>

				<VCol cols="8" class="text-right d-none d-md-inline">
					<div :class="{ light: !isHomePage }">
						<span v-for="({ name, label }, key, index) of links" :key="key">
							<span
								v-if="index !== 0"
								class="select-none mx-2"
								aria-hidden="true"
								:class="{ 'white--text': isHomePage }"
							>
								&bull;
							</span>
							<RouterLink color="white" :to="{ name }" class="nav-link">
								{{ label }}
							</RouterLink>
						</span>
					</div>
				</VCol>
			</VRow>
		</VAppBar>

		<MobileNavigationPanel :links="links" :is-open="isPanelOpen" @toggle-panel="onTogglePanel" />
	</div>
</template>

<style>
a.nav-link {
	color: white !important;
}

div.light a,
.light.nav-link {
	color: rgb(0 0 0 / 87%) !important;
}

.app-bar {
	padding-top: 30px;
}

.font-display {
	font-family: 'Times New Roman', Times, serif;
	font-size: 2em !important;
}

.select-none {
	user-select: none;
}

.title-wrapper {
	padding: 0 !important;
}

.menu-button {
	height: 100% !important;
	vertical-align: bottom !important;
}
</style>
