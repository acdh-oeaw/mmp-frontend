<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router/composables';

import DateRangeForm from '@/components/date-range-form.vue';
import ExploreWelcomeScreen from '@/components/explore-welcome-screen.vue';
import PassageSearchForm from '@/components/passage-search-form.vue';
import SearchOptions from '@/components/search-options.vue';
import { useVuetify } from '@/lib/use-vuetify';

const router = useRouter();
const route = useRoute();

const isSliderVisible = computed(() => route.name !== 'Word Cloud');
/**
 * When no search filters have been set, display an initial welcome screen.
 */
const isWelcomeScreenVisible = ref(
	Object.keys(route.query).length === 0 && Object.keys(route.params).length === 0
);

const tabs = {
	'search-results': { name: 'explore-search-results', label: 'Search results' },
	'network-graph': { name: 'explore-network-graph', label: 'Network Graph' },
	'geo-map': { name: 'explore-geo-map', label: 'Map' },
	'word-cloud': { name: 'explore-word-cloud', label: 'Word Cloud' },
};

function onChange(name: string) {
	router.push({ name, query: route.query });
}

const vuetify = useVuetify();
</script>

<template>
	<div>
		<VContainer>
			<VRow justify="center">
				<VCol cols="12" xl="8">
					<VRow class="grey-bg">
						<VCol :cols="vuetify.breakpoint.mobile ? 12 : 1">
							<VMenu :close-on-content-click="false">
								<template #activator="{ on, attrs }">
									<VBtn block depressed min-height="50px" height="100%" v-bind="attrs" v-on="on">
										<VIcon>mdi-cog</VIcon>
										<VIcon>mdi-chevron-down</VIcon>
									</VBtn>
								</template>
								<SearchOptions />
							</VMenu>
						</VCol>

						<VCol :cols="vuetify.breakpoint.mobile ? 12 : 11">
							<PassageSearchForm @submit="isWelcomeScreenVisible = false" />
						</VCol>
					</VRow>

					<VRow class="grey-bg">
						<template v-if="!vuetify.breakpoint.mobile">
							<VCol>
								<!-- FIXME: this should not be a button -->
								<VBtn text small class="disable-events">View as</VBtn>
							</VCol>
							<VCol v-for="(tab, key) of tabs" :key="key">
								<!-- TODO: on case-study view these are Tabs -->
								<VBtn
									text
									block
									small
									class="view-picker"
									:disabled="route.name === tab.name"
									:class="{ active: route.name === tab.name }"
									:to="{ name: tab.name, query: route.query }"
								>
									{{ tab.label }}
								</VBtn>
							</VCol>
						</template>

						<template v-else>
							<VCol cols="12">
								<!-- FIXME: this should be a menu, not a select -->
								<VSelect
									:items="Object.values(tabs).map((tab) => tab.name)"
									item-text="label"
									item-value="name"
									label="View as"
									@change="onChange"
								/>
							</VCol>
						</template>

						<VCol
							:class="{
								'text-right': !vuetify.breakpoint.mobile,
								'text-center': vuetify.breakpoint.mobile,
							}"
						>
							<VBtn text block small class="justify-end" :to="{ name: 'browse' }">
								<VIcon>mdi-format-list-bulleted</VIcon>
								List All Entities
							</VBtn>
						</VCol>
					</VRow>

					<VRow v-if="isWelcomeScreenVisible" align="center" justify="center">
						<VCol cols="12" md="8">
							<ExploreWelcomeScreen />
						</VCol>
					</VRow>

					<VRow v-else>
						<RouterView />
					</VRow>

					<VRow v-show="isSliderVisible">
						<VCol>
							<DateRangeForm />
						</VCol>
					</VRow>
				</VCol>
			</VRow>
		</VContainer>
	</div>
</template>

<style>
div.row a.view-picker.theme--light.v-btn.v-btn--disabled {
	color: rgb(0 0 0 / 87%) !important;
}

img.icon {
	height: 100%;
	width: 100%;
}

.disable-events {
	pointer-events: none;
}

.active {
	background-color: #e5e7eb !important;
}

.grey-bg {
	background-color: #e8ebf0;
	border-radius: 5px;
	margin-bottom: 22px;
}

.justify-end {
	justify-content: flex-end;
}

.slider {
	margin-top: 30px;
}

.v-slider {
	height: 44px;
}

div.v-slider__thumb-label.primary {
	background-color: transparent !important;
	height: 1.2rem !important;
	color: rgb(0 0 0 / 87%) !important;
}
</style>
