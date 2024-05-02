<script lang="ts" setup>
/* stylelint-disable color-named */
import { NuxtImg, NuxtLink } from "#components";
</script>

<template>
	<section class="h-full flex items-center">
		<div
			class="relative grid h-full place-items-center border-b bg-neutral-900 text-white w-full p-8"
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
					<h1 class="text-4xl font-extrabold uppercase sm:text-5xl lg:text-5xl xl:text-7xl">
						Mapping Medieval Peoples
					</h1>
					<h2 class="text-xl font-extrabold sm:text-2xl lg:text-3xl xl:text-4xl">
						Visualising Semantic Landscapes in Early Medieval Europe
					</h2>
				</div>

				<div
					class="grid max-w-3xl gap-4 leading-7"
					style="
						text-shadow:
							-1px -1px 0 rgb(0 0 0),
							1px -1px 0 rgb(0 0 0),
							-1px 1px 0 rgb(0 0 0),
							1px 1px 0 rgb(0 0 0);
					"
				>
					<p class="font-bold text-justify md:text-center">
						<i>Mapping Medieval Peoples</i>
						(MMP) examines medieval perceptions of peoples and space and the intellectual frameworks
						in which they came into being through reconstructing the mental maps of medieval
						authors. As medieval conceptions of space were expressed and developed primarily through
						narrative, in MMP we have developed applications for network analysis and
						geovisualisation, using an interdisciplinary approach which allows us to visualise
						narrative descriptions of space. This allows us to elucidate how space and the peoples
						inhabiting it were described and imagined, and to make the different angles from which
						ethnic groups were described more visible, while bringing out the complexities and
						ambiguities of ethnic terminology.
					</p>
				</div>

				<div class="w-full max-w-3xl grid gap-6 sm:grid-cols-3">
					<div class="grid gap-1">
						<NuxtLink
							class="inline-flex items-center justify-center rounded border bg-neutral-100 px-12 py-4 text-sm font-medium uppercase text-neutral-900 shadow-md transition hover:bg-white"
							href="/explore/search-results"
						>
							Search the data
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
					<div class="grid gap-1">
						<NuxtLink
							class="inline-flex items-center justify-center rounded border bg-neutral-100 px-12 py-4 text-sm font-medium uppercase text-neutral-900 shadow-md transition hover:bg-white"
							href="/about"
						>
							Learn more
						</NuxtLink>
					</div>
				</div>

				<div
					style="
						text-shadow:
							-1px -1px 0 rgb(0 0 0),
							1px -1px 0 rgb(0 0 0),
							-1px 1px 0 rgb(0 0 0),
							1px 1px 0 rgb(0 0 0);
					"
				>
					<p>
						This project has received funding from the ÖAW Innovation Fund Research, Science and
						Society (2020-2023)
					</p>
					<p>Hosted by ACDH-CH &amp; Imafo</p>
					<p class="mx-auto mt-8 text-white">
						<a href="https://www.oeaw.ac.at/imafo" target="_blank">
							<NuxtImg
								alt="ACDH-CH Logo"
								src="/assets/images/logo-acdh-white.svg"
								class="inline-block h-16 px-4"
							/>
							<span class="sr-only">ACDH-CH Logo</span>
						</a>
						<a href="https://www.oeaw.ac.at/acdh/" target="_blank">
							<NuxtImg
								alt="Imafo Logo"
								src="/assets/images/logo-imafo-white.png"
								class="inline-block h-16 px-4"
							/>
							<span class="sr-only">Imafo Logo</span>
						</a>
						<a href="https://www.oeaw.ac.at/" target="_blank">
							<NuxtImg
								alt="Imafo Logo"
								src="/assets/images/logo-oeaw.svg"
								class="inline-block h-16 px-4 text-white"
							/>
							<span class="sr-only">Oeaw Logo</span>
						</a>
					</p>
				</div>
			</div>
		</div>
	</section>
</template>
