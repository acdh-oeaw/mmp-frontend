<script lang="ts" setup>
import * as slider from "@zag-js/slider";
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
	value: number;
}>();

const emit = defineEmits<{
	(event: "change", value: number): void;
}>();

const service = useMachine(slider.machine, {
	id: props.id,
	defaultValue: [props.value],
	min: props.min,
	max: props.max,
	name: props.name,
	step: props.step,
	onValueChangeEnd({ value: [value] }) {
		if (value !== undefined) emit("change", value);
	},
});

const api = computed(() => slider.connect(service, normalizeProps));
</script>

<template>
	<div v-bind="api.getRootProps()">
		<div class="flex items-center justify-end gap-1 text-xs font-medium text-neutral-600">
			<label class="sr-only" v-bind="api.getLabelProps()">{{ props.label }}</label>
			<output v-bind="api.getValueTextProps()">
				{{ getDateRangeLabel(api.value[0], undefined) }}
			</output>
		</div>
		<div v-bind="api.getControlProps()" class="relative flex items-center py-2.5">
			<div v-bind="api.getTrackProps()" class="h-0.5 flex-1 rounded-full bg-neutral-100">
				<div
					v-bind="api.getRangeProps()"
					class="h-full rounded-full bg-neutral-400 disabled:bg-neutral-200"
				/>
			</div>
			<div
				v-bind="api.getThumbProps({ index: 0 })"
				class="flex h-5 w-5 items-center justify-center rounded-full border border-neutral-400 bg-white shadow hover:border-neutral-500 focus:outline-1 focus:outline-blue-500 disabled:bg-neutral-200"
			>
				<input v-bind="api.getHiddenInputProps({ index: 0 })" />
			</div>
		</div>
	</div>
</template>
