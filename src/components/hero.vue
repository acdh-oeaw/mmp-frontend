<script lang="ts" setup>
import { NuxtImg, NuxtLink } from "#components";
</script>

<template>
	<section>
		<div class="relative grid place-items-center border-b px-8 py-32">
			<NuxtImg
				alt=""
				class="absolute inset-0 h-full w-full object-cover"
				loading="eager"
				src="/assets/images/hero.jpg"
			/>
			<div
				class="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-900/75 to-neutral-900/25"
			/>

			<div class="relative grid justify-items-center gap-12 text-center text-white">
				<h1 class="text-8xl font-bold">Mapping Medieval Peoples</h1>

				<div class="grid max-w-3xl gap-4 leading-7">
					<p class="font-bold">
						In the turbulent world of the early Middle Ages, ethnicity became a key resource in the
						reorganization of the political landscape. Mapping Medieval Peoples (MMP) proposes an
						innovative technical solution to analyze and visualize the "mental maps" and the
						semantic fields that emerge from the analysis of late antique and early medieval source
						material.
					</p>

					<p>
						We attempt to reconstruct &quot;mental maps&quot; of a world of peoples, and will offer
						insights into the interplay between ethnonyms, religious terms, as well as attributes,
						traits and stereotypes, thus surveying the language employed to create ethnic entities
						and to distinguish them from each other.
					</p>
				</div>

				<div class="grid grid-cols-2 gap-6">
					<div class="grid gap-1">
						<NuxtLink
							class="inline-flex items-center justify-center rounded border bg-neutral-900 px-12 py-4 text-sm font-medium uppercase tracking-wider shadow-md transition hover:bg-neutral-700"
							href="/explore/search-results"
						>
							Search our data
						</NuxtLink>
						<span>For interactive analyses</span>
					</div>

					<div class="grid gap-1">
						<NuxtLink
							class="inline-flex items-center justify-center rounded border bg-neutral-900 px-12 py-4 text-sm font-medium uppercase tracking-wider shadow-md transition hover:bg-neutral-700"
							href="/case-studies/4/timeline"
						>
							Read &quot;Carolingian Avaria&quot;
						</NuxtLink>
						<span>A case study</span>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
