<script lang="ts" setup>
import * as rangeSlider from "@zag-js/range-slider";
import { normalizeProps, useMachine } from "@zag-js/vue";
import { computed } from "vue";

import { getDateRangeLabel } from "@/lib/get-label";

const props = defineProps<{
	id: string;
	label: string;
	max: number;
	min: number;
	name?: string;
	step: number;
	values: [number, number];
}>();

const emit = defineEmits<{
	(event: "change", values: [number, number]): void;
}>();

const [state, send] = useMachine(
	rangeSlider.machine({
		id: props.id,
		value: props.values,
		min: props.min,
		max: props.max,
		name: props.name,
		step: props.step,
		minStepsBetweenThumbs: 1,
		onChangeEnd({ value }) {
			emit("change", value as [number, number]);
		},
	}),
);

const api = computed(() => {
	return rangeSlider.connect(state.value, send, normalizeProps);
});
</script>

<template>
	<div ref="ref" v-bind="api.rootProps" class="grid gap-y-1">
		<div class="flex items-center justify-end gap-1 text-xs font-medium text-neutral-600">
			<!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
			<label class="sr-only" v-bind="api.labelProps">{{ props.label }}</label>
			<output v-bind="api.outputProps">
				{{ getDateRangeLabel(...(api.value as [number, number])) }}
			</output>
		</div>
		<div v-bind="api.controlProps" class="relative flex items-center py-2.5">
			<div v-bind="api.trackProps" class="h-0.5 flex-1 rounded-full bg-neutral-100">
				<div
					v-bind="api.rangeProps"
					class="h-full rounded-full bg-neutral-400 disabled:bg-neutral-200"
					style="border-radius: inherit"
				/>
			</div>
			<div
				v-for="(_, index) in api.value"
				:key="index"
				v-bind="api.getThumbProps(index)"
				class="flex h-5 w-5 items-center justify-center rounded-full border border-neutral-500 bg-white shadow focus:outline-1 focus:outline-blue-500 disabled:bg-neutral-200"
			>
				<input v-bind="api.getHiddenInputProps(index)" />
			</div>
		</div>
	</div>
</template>
