<script lang="ts" setup>
import { NuxtImg, NuxtLink } from "#components";
</script>

<template>
	<section>
		<div class="relative grid place-items-center border-b bg-neutral-900 px-8 py-48 text-white">
			<NuxtImg
				alt=""
				class="absolute inset-0 h-full w-full object-cover"
				loading="eager"
				src="/assets/images/hero.jpg"
			/>

			<div class="relative grid justify-items-center gap-12 text-center">
				<div class="grid gap-4">
					<h1 class="text-7xl font-extrabold uppercase">Mapping Medieval Peoples</h1>
					<h2 class="text-4xl font-extrabold">
						Visualizing Semantic Landscapes in Early Medieval Europe
					</h2>
				</div>

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
							class="inline-flex items-center justify-center rounded border bg-neutral-100 px-12 py-4 text-sm font-medium uppercase text-neutral-900 shadow-md transition hover:bg-neutral-900 hover:text-white"
							href="/explore/search-results"
						>
							Search our data
						</NuxtLink>
						<span>For interactive analyses</span>
					</div>

					<div class="grid gap-1">
						<NuxtLink
							class="inline-flex items-center justify-center rounded border bg-neutral-100 px-12 py-4 text-sm font-medium uppercase text-neutral-900 shadow-md transition hover:bg-neutral-900 hover:text-white"
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
