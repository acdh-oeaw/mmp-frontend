<script lang="ts" setup>
import { ArrowsPointingInIcon, ArrowsPointingOutIcon } from "@heroicons/vue/24/outline";

import ToolbarIconButton from "@/components/toolbar-icon-button.vue";
import { useFullScreen } from "@/lib/use-full-screen";
import { NuxtLink } from "#components";
import { useRoute } from "#imports";

const isFullscreen = useFullScreen();
</script>

<template>
	<NuxtLink
		:href="{
			query: {
				...useRoute().query,
				'view-mode': isFullscreen ? undefined : 'fullscreen',
			},
		}"
	>
		<ToolbarIconButton label="Fullscreen">
			<ArrowsPointingInIcon v-if="isFullscreen" class="size-5 shrink-0" />
			<ArrowsPointingOutIcon v-else class="size-5 shrink-0" />
		</ToolbarIconButton>
	</NuxtLink>
</template>
