<script lang="ts" setup>
import { NuxtLink } from "#components";
import { metadata } from "@/config/metadata.config";
</script>

<template>
	<footer class="border-t border-neutral-200">
		<div class="mx-auto flex max-w-7xl items-center justify-between gap-8 px-8 py-2 text-xs">
			<div>
				&copy; {{ new Date().getUTCFullYear() }}
				<a
					class="transition hover:text-neutral-700"
					:href="metadata.creator.website"
					rel="noreferrer"
					target="_blank"
				>
					ACDH-CH
				</a>
			</div>
			<div>
				<NuxtLink class="transition hover:text-neutral-700" href="/imprint">Imprint</NuxtLink>
			</div>
		</div>
	</footer>
</template>
