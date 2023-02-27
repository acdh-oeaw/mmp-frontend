<script lang="ts" setup>
import { NuxtImg, NuxtLink } from "#components";
</script>

<template>
	<section class="h-full max-h-[min(100%,1280px)]">
		<div
			class="relative grid h-full place-items-center border-b bg-neutral-900 px-8 py-32 text-white"
		>
			<NuxtImg
				alt=""
				class="absolute inset-0 h-full w-full object-cover opacity-75"
				format="webp"
				:height="1280"
				loading="eager"
				src="/assets/images/hero.jpg"
				sizes="2xl:100vw xl:100vw lg:100vw md:100vw sm:100vw xs:100vw"
			/>

			<div class="relative grid justify-items-center gap-12 text-center">
				<div class="grid gap-4">
					<h1 class="text-4xl font-extrabold uppercase sm:text-5xl lg:text-6xl xl:text-7xl">
						Mapping Medieval Peoples
					</h1>
					<h2 class="text-xl font-extrabold sm:text-2xl lg:text-3xl xl:text-4xl">
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

				<div class="grid gap-6 sm:grid-cols-2">
					<div class="grid gap-1">
						<NuxtLink
							class="inline-flex items-center justify-center rounded border bg-neutral-100 px-12 py-4 text-sm font-medium uppercase text-neutral-900 shadow-md transition hover:bg-white"
							href="/explore/search-results"
						>
							Search our data
						</NuxtLink>
					</div>

					<div class="grid gap-1">
						<NuxtLink
							class="inline-flex items-center justify-center rounded border bg-neutral-100 px-12 py-4 text-sm font-medium uppercase text-neutral-900 shadow-md transition hover:bg-white"
							href="/case-studies"
						>
							Read case studies
						</NuxtLink>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
