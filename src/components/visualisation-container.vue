<script lang="ts" setup>
import { ref } from "vue";

import { useElementDimensions } from "@/lib/use-element-dimensions";

const elementRef = ref<HTMLElement | null>(null);

const dimensions = useElementDimensions(elementRef);
</script>

<template>
	<div
		ref="elementRef"
		class="relative isolate grid h-full w-full overflow-hidden rounded bg-neutral-50"
		data-visualisation-container
	>
		<slot v-if="dimensions != null" :width="dimensions.width" :height="dimensions.height" />
	</div>
</template>
