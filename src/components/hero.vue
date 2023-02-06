<script lang="ts" setup>
import bgImage from '@/assets/images/europe.jpg';
</script>

<template>
	<VParallax :src="bgImage" class="home-parallax text-center home-head">
		<div class="parallax-wrapper">
			<VContainer>
				<VRow align="center" justify="center">
					<VCol cols="12">
						<h1 class="home-title text-h3 text-lg-h1 text-decoration-none">
							Mapping Medieval Peoples
						</h1>
					</VCol>
				</VRow>

				<VRow justify="center">
					<VCol cols="12" lg="8">
						<p class="text-subtitle-1 font-weight-bold">
							In the turbulent world of the early Middle Ages, ethnicity became a key resource in
							the reorganization of the political landscape. Mapping Medieval Peoples (MMP) proposes
							an innovative technical solution to analyze and visualize the "mental maps" and the
							semantic fields that emerge from the analysis of late antique and early medieval
							source material.
						</p>
						<p class="text-subtitle-1">
							We attempt to reconstruct "mental maps" of a world of peoples, and will offer insights
							into the interplay between ethnonyms, religious terms, as well as attributes, traits
							and stereotypes, thus surveying the language employed to create ethnic entities and to
							distinguish them from each other.
						</p>
					</VCol>
				</VRow>

				<VRow justify="center">
					<VCol cols="12" lg="3" sm="5">
						<VBtn large block color="secondary" :to="{ name: 'explore' }">Search our Data</VBtn>
						<span class="button-subtitle">For Interactive Analyses</span>
					</VCol>

					<VCol cols="12" lg="3" sm="5">
						<p>
							<VBtn block color="primary" large :to="{ name: 'case-study', params: { id: 4 } }">
								Read &bdquo;Carolingian Avaria&ldquo;
							</VBtn>
							<span class="button-subtitle">A Case Study</span>
						</p>
					</VCol>
				</VRow>
			</VContainer>
		</div>
	</VParallax>
</template>

<style>
.button-subtitle {
	line-height: 40px;
	font-size: 1rem;
	vertical-align: top;
}

.home-head {
	min-height: 600px;
	height: unset !important;
}

.home-head div.v-parallax__content {
	background: linear-gradient(180deg, rgb(15 18 38 / 100%) 25%, rgb(15 18 38 / 30%) 100%);
	padding: 0;
	min-height: 600px;
}

h1.home-title {
	text-decoration-line: underline;
	text-underline-offset: 3px;
	text-decoration-thickness: 3px;
	z-index: 100;
}
</style>
