<script lang="ts" setup>
import { type Passage, usePassageById } from "~/src/api";
import { getAuthorLabel, getDateRangeLabel } from "~/src/lib/get-label";

const props = defineProps<{
	id: Passage["id"];
}>();

const passageQuery = usePassageById({ id: props.id });
const passage = passageQuery.data;
</script>

<template>
	<div></div>
	<div v-if="passage" class="grid gap-2">
		<div v-if="passage.start_date || passage.end_date" class="grid gap-0.5">
			<span class="font-medium uppercase">Temporal coverage</span>
			<div>{{ getDateRangeLabel(passage.start_date, passage.end_date) }}</div>
		</div>
		<div v-if="passage.text" class="grid gap-0.5">
			<span class="font-medium uppercase">Text</span>
			<div>{{ passage.text.title }}</div>
		</div>
		<div v-if="passage.text" class="grid gap-0.5">
			<span class="font-medium uppercase">Authors</span>
			<div>{{ passage.text.autor.map(getAuthorLabel).join(", ") }}</div>
		</div>
		<div v-if="passage.text" class="grid gap-0.5">
			<span class="font-medium uppercase">Time of composition</span>
			<div>{{ getDateRangeLabel(passage.text.not_before, passage.text.not_after) }}</div>
		</div>
		<div v-if="passage.summary" class="grid gap-0.5">
			<span class="font-medium uppercase">Summary</span>
			<div>{{ passage.summary }}</div>
		</div>
		<div v-if="passage.zitat" class="grid gap-0.5">
			<span class="font-medium uppercase">Quote</span>
			<div>{{ passage.zitat }}</div>
		</div>
		<div v-if="passage.kommentar" class="grid gap-0.5">
			<span class="font-medium uppercase">Comment</span>
			<div>{{ passage.kommentar }}</div>
		</div>
	</div>
</template>
