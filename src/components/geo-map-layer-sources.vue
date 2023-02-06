<script lang="ts" setup>
import type { GeojsonLayer } from '@/api';

const _props = defineProps<{
	layers: Array<GeojsonLayer>;
}>();
</script>

<template>
	<VExpansionPanels>
		<VExpansionPanel>
			<VExpansionPanelHeader>Layer sources</VExpansionPanelHeader>
			<VExpansionPanelContent class="ma-2">
				<ul role="list">
					<li v-for="layer of layers" :key="layer.id">
						<div>{{ layer.title }}</div>
						<div>{{ layer.attribution }}</div>
						<div>{{ layer.description }}</div>
					</li>
				</ul>
			</VExpansionPanelContent>
		</VExpansionPanel>
	</VExpansionPanels>
</template>
