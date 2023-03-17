<script lang="ts" setup>
import MainContent from "@/components/main-content.vue";
import StoryNetworkGraph from "@/components/story-network-graph.vue";
import { defaultSearchFilters } from "@/lib/search/use-search-filters";
import { useHead } from "#imports";

const title = "About";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});
</script>

<template>
	<MainContent>
		<div class="mx-auto w-full max-w-4xl px-8 py-4">
			<h1 class="sr-only">About</h1>
			<div class="prose-sm">
				<h1>About</h1>
				<h2>Find out more about our aims and methods</h2>
				<p>
					From the world of Late Antiquity and the early Middle Ages, numerous ethnic names, such as
					Goths, Huns, Lombards or Franks, have been handed down to us. Especially in the course of
					the early Middle Ages (5th-11th centuries), ethnic identity played an important role in
					the development of new political and religious communities and in the legitimation of
					political power. However, ethnic attributions were not at all firmly defined. On the
					contrary, even supposedly obvious labels of different origins such as language, clothing
					or weapons were not reliable criteria for the assignment to a particular people. So, what
					do these peoples' names tell us about medieval peoples, about their communities and about
					the space they inhabited? What did they mean for the scholars who recorded them in Latin,
					Greek or Syriac texts, and for their audience?
				</p>
				<p>
					The aim of MMP is to reconstruct the mental maps of medieval authors and thereby to
					elucidate firstly how ethnic identifications helped readers to perceive the medieval
					social world, and, secondly, how attributions to peoples and perceptions of space were
					intertwined. This touches upon questions of the creation and appropriation of territory,
					on the construction of otherness, on the influence of religious ideas and terminology for
					conceptions of space and peoples, and on the circumstances under which perceptions of
					peoples and space changed over the course of time.
				</p>
				<p>
					Find out more about our project and the people behind it in this short movie, a
					contribution to the exhibition
					<a class="font-semibold underline" href="https://www.youtube.com/watch?v=JHv7U96k78g">
						Reiternomaden in Europa
					</a>
				</p>
				<h2>Find out more about our sources</h2>
				<p>
					MMP includes ca. 5500 passages from 1150 different texts from 440 different authors
					covering a broad range of medieval source material (including historiography, hagiography,
					exegesis, charters, geographical works, legislative texts, conciliar acts, homilies,
					annals). We have identified 690 keywords, organised into four categories: 1.
					<b>Keywords</b>
					(which include a wider range of ethnic terminology such as gens, patria, then attributes,
					titles, stereotypical traits); 2.
					<b>Ethnonyms</b>
					<span>;</span>
					3.
					<b>Personal names</b>
					(such as important political players); 4.
					<b>Regions/geographical names</b>
					(which include spatial terms, such as mountains, rivers, as well as abstract concepts like
					East and North, and geographical regions that were also used for political communities).
					<br />
					All keywords and passages from Latin and Greek texts have been selected that are in some
					way relevant for the significance of the terms and contribute to a better understanding of
					ethnic terminology.
				</p>
				<p>
					Our data includes, firstly, the
					<b>Case Studies</b>
					and, secondly, a broader corpus of data that has been generated in the database project
					<a class="font-semibold underline" href="https://www.oeaw.ac.at/imafo/gens/">
						GENS: Group Terminology and Ethnic Nomenclature
					</a>
					<span>:</span>
					A Semantic Database (Latin Europe c. 400-1200), in the ERC SCIRE - Social Cohesion,
					Identity and Religion in Europe (2007-2013) by Walter Pohl, Cinzia Grifoni and Katharina
					Winckler.
					<br />
					The source material of the
					<b>Case Studies</b>
					and the
					<b>GENS Database</b>
					has a slightly different focus: the
					<b>Case Studies</b>
					have been modelled along specific research questions and allow an in-depth study of a
					specific people, a region, an ethnonym, while the
					<b>GENS Database</b>
					focuses on the meanings of Romanness in the post-imperial West and allows a comprehensive
					selection of early medieval Latin sources on that topic. These terms, all in relation to
					Romanness, can be searched for nearly comprehensively: alienigena; civ* roman*; civ* +
					roman*; gens Christiana/christianorum; gens romana; gens + romana; gent* + roman*; gens
					*orum; gent* + Dei; popul* + gentium; popul* + nationum; Romania*; romana* civita*; natio*
					+ gentium
				</p>
				<h2>Find out more about our search options</h2>
				<p>
					MMP is intended to provide a wide overview of how ethnic terminology was employed and
					perceptions of space were constructed. It allows a qualitative search and evaluation of
					meaning and recurrence of ethnic and spatial terminology until the first half of the 13th
					century.
				</p>
				<b>You can search for:</b>
				<ul>
					<li>The ethnoyms a specific author uses.</li>
					<div class="relative h-96 w-full">
						<StoryNetworkGraph
							:search-filters="{
								...defaultSearchFilters,
								author: [24],
							}"
						/>
					</div>
					<li>Which peoples are mentioned together?</li>
					<li>The combinations between ethnonyms and keywords via Union/Intersection</li>
					<li>You can compare authors and their use of keywords</li>
					<li>
						The combination of a place name and an ethnonym or a specific region in a specific
						period (time of composition or temporal coverage)
					</li>
				</ul>
				<h2>Find out more how the data is visualized:</h2>
				<p>
					MMP provides a visual representation of the semantic field of ethnic terminology
					<span>(</span>
					<b>graph</b>
					<span>),</span>
					it has a spatial dimension
					<span>(</span>
					<b>geovisualization</b>
					<span>),</span>
					and it integrates the temporal perspective, using two different temporal perspectives
					<span>(</span>
					<b>time of compostition</b>
					and
					<b>temporal coverage</b>
					of the events described) to show how, for instance, the perception of a specific people or
					keyword changed and varied over the course of time and from one historical context to
					another. Another feature are
					<b>word clouds</b>
					and
					<b>pie charts</b>
					<span>:</span>
					while the graphs work with selected keywords, and provide a qualitative perspective, these
					two offer a quantitative perspective. They compare the occurrence of the selected keywords
					in a passage or case study with the occurrence of lemmatized keywords according to their
					quantitative occurrence.
				</p>
				<h2>Find out more about our research team</h2>
				<div class="grid grid-cols-2">
					<span>Project Leaders</span>
					<ul class="m-0 p-0">
						<li>
							<a
								href="https://www.oeaw.ac.at/imafo/forschung/historische-identitaetsforschung/mitarbeiterinnen/walter-pohl"
								class="underline"
							>
								Walter Pohl (Imafo / AAS)
							</a>
						</li>
						<li>
							<a
								href="https://www.oeaw.ac.at/imafo/forschung/historische-identitaetsforschung/mitarbeiterinnen/veronika-wieser/"
								class="underline"
							>
								Veronika Wieser (Imafo / AAS)
							</a>
						</li>
					</ul>
					<span>Project Team Imafo: Principal Investigators and Associated Researchers</span>
					<ul class="m-0 p-0">
						<li>Nicola Edelmann</li>
						<li>
							<a
								href="https://ifg.univie.ac.at/ueber-uns/mitarbeiterinnen/gastprofessorinnen/clemens-gantner/"
								class="underline"
							>
								Clemens Gantner (University of Vienna)
							</a>
						</li>
						<li>
							<a
								href="https://www.oeaw.ac.at/imafo/forschung/historische-identitaetsforschung/mitarbeiterinnen/laura-gazzoli"
								class="underline"
							>
								Laura Gazzoli (Imafo / AAS)
							</a>
						</li>
						<li>
							<a
								href="https://www.oeaw.ac.at/imafo/forschung/historische-identitaetsforschung/mitarbeiterinnen/thomas-gobbitt"
								class="underline"
							>
								Thomas Gobbitt (Imafo / AAS)
							</a>
						</li>
						<li>
							<a
								href="https://www.oeaw.ac.at/imafo/forschung/historische-identitaetsforschung/mitarbeiterinnen/salvatore-liccardo"
								class="underline"
							>
								Salvatore Liccardo (HistoGenes / University of Vienna)
							</a>
						</li>
						<li>
							<a
								href="https://www.oeaw.ac.at/imafo/forschung/historische-identitaetsforschung/mitarbeiterinnen/patrick-marschner/"
								class="underline"
							>
								Patrick Marschner (Imafo / AAS)
							</a>
						</li>
						<li>
							<a href="https://www.ucc.ie/en/locus/people/" class="underline">
								Diarmuid Ó Riain (University College Cork)
							</a>
						</li>
						<li>Katharina Winckler (University of Trento)</li>
					</ul>
					<span>Project Team ACDH - CH</span>
					<ul class="m-0 p-0">
						<li>Matej Ďurčo</li>
						<li>Peter Andorfer</li>
						<li>Robin Kaggl</li>
						<li>Stefan Probst</li>
					</ul>
				</div>
				<h2>Find out more about our events and publications</h2>
				<p>
					<b>Workshop</b>
					&nbsp;
					<a
						class="underline"
						href="https://www.oeaw.ac.at/imafo/veranstaltungen/detail/ab-aquilone-conceptions-of-space-and-identities-in-europes-far-north-in-the-middle-ages"
					>
						'Ab aquilone: conceptions of space and identities in Europe's far north in the middle
						ages'
					</a>
					<span>,</span>
					June 10, 2022, organized by Laura Gazzoli
				</p>
				<p>
					<b>Workshop</b>
					&nbsp;
					<a
						class="underline"
						href="https://www.oeaw.ac.at/imafo/veranstaltungen/detail/ethnonyms-and-the-order-of-space-in-the-frankish-realms-6th-9th-c"
					>
						'Ethnonyms and the order of space in the Frankish realms (6th to 9th c.)'
					</a>
					<span>,</span>
					June 10, 2022, organized by Laura Gazzoli
				</p>
				<p>
					In preparation: collected volume ‘Mapping Medieval Peoples: New Approaches to Ethnic
					Identity and Space, 400-1400CE’, ed. Laura Gazzoli, Veronika Wieser, Katharina Winckler
					(Brepols, 2024)
				</p>
				<h2>Find out more about our resources</h2>
				<h2>Contact</h2>
				<p>
					Veronika Wieser (PI):
					<a
						class="underline"
						href="&#109;&#97;&#105;&#108;&#116;&#111;&#58;%76%65%72%6F%6E%69%6B%61%2E%77%69%65%73%65%72%40%6F%65%61%77%2E%61%63%2E%61%74"
					>
						veronika.wieser(at)oeaw.ac.at
					</a>
				</p>
				<p>
					For a more expert search or if you would like to conduct a case study, please contact
					<a
						class="underline"
						href="&#109;&#97;&#105;&#108;&#116;&#111;&#58;%76%65%72%6F%6E%69%6B%61%2E%77%69%65%73%65%72%40%6F%65%61%77%2E%61%63%2E%61%74"
					>
						veronika.wieser(at)oeaw.ac.at
					</a>
				</p>
			</div>
		</div>
	</MainContent>
</template>
