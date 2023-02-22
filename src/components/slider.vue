<script lang="ts" setup>
import * as slider from "@zag-js/slider";
import { normalizeProps, useMachine } from "@zag-js/vue";
import { computed } from "vue";

const props = defineProps<{
	id: string;
	label: string;
	max: number;
	min: number;
	name?: string;
	step: number;
	value: number;
}>();

const emit = defineEmits<{
	(event: "change", value: number): void;
}>();

const [state, send] = useMachine(
	slider.machine({
		id: props.id,
		value: props.value,
		min: props.min,
		max: props.max,
		name: props.name,
		step: props.step,
		onChangeEnd({ value }) {
			emit("change", value);
		},
	}),
);

const api = computed(() => {
	return slider.connect(state.value, send, normalizeProps);
});
</script>

<template>
	<div ref="ref" v-bind="api.rootProps">
		<!-- <div>
			<label v-bind="api.labelProps">
			{{  props.label }}
			</label>
			<output v-bind="api.outputProps">{{ api.value }}</output>
		</div> -->
		<div v-bind="api.controlProps">
			<div v-bind="api.trackProps">
				<div v-bind="api.rangeProps" />
			</div>
			<div v-bind="api.thumbProps">
				<input v-bind="api.hiddenInputProps" />
			</div>
		</div>
	</div>
</template>

<style>
[data-part="root"][data-focus] {
	/* styles for root focus state */
}

[data-part="thumb"]:focus {
	/* styles for thumb focus state */
}

[data-part="control"][data-focus] {
	/* styles for control focus state */
}

[data-part="track"][data-focus] {
	/* styles for track focus state */
}

[data-part="range"][data-focus] {
	/* styles for range focus state */
}

/** disabled */

[data-part="root"][data-disabled] {
	/* styles for root disabled state */
}

[data-part="label"][data-disabled] {
	/* styles for label disabled state */
}

[data-part="control"][data-disabled] {
	/* styles for control disabled state */
}

[data-part="output"][data-disabled] {
	/* styles for output disabled state */
}

[data-part="thumb"][data-disabled] {
	/* styles for thumb disabled state */
}

[data-part="range"][data-disabled] {
	/* styles for thumb disabled state */
}
</style>
