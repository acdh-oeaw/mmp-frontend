<script lang="ts" setup>
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";

function onSubmit() {
	//
}
</script>

<template>
	<form novalidate role="search" @submit.prevent="onSubmit">
		<label>
			<span>Search</span>
			<input name="q" type="search" />
		</label>

		<button class="flex items-center gap-2" type="submit">
			<span class="md:hidden">Search</span>
			<MagnifyingGlassIcon class="h-6 w-6" />
		</button>
	</form>
</template>
