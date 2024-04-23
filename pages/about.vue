<script lang="ts" setup>
import { ChevronRightIcon } from "@heroicons/vue/24/outline";

import AboutDisclosure from "@/components/about-disclosure.vue";
import MainContent from "@/components/main-content.vue";
import { NuxtLink } from "#components";
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
			<h1 class="sr-only">Find out more about..</h1>
			<div class="prose-sm">
				<h1>Find out more about..</h1>
				<div class="divide-y">
					<AboutDisclosure opened title="Our aims and methods">
						<p>
							From the world of Late Antiquity and the early Middle Ages, numerous ethnic names
							(such as Goths, Huns, Lombards or Franks) have been handed down to us. Especially in
							the course of the early Middle Ages (5th-11th centuries), ethnic identity played an
							important role in the development of new political and religious communities and the
							legitimation of political power. However, ethnic attributions were not all firmly
							defined - even more obvious indications of different origins such as language,
							clothing or weapons were not reliable criteria for the assignment to a particular
							people. What can these names tell us about medieval peoples, their communities and the
							space they inhabited? What did they mean for the scholars who recorded them in Latin,
							Greek or Syriac texts, and for their audience?
						</p>
						<p>
							The aim of MMP is to reconstruct the mental maps of medieval authors and thereby to
							elucidate how ethnic identifications helped readers to perceive the medieval social
							world, and thus, how attributions to peoples and perceptions of space were
							intertwined. This touches on questions of the creation and appropriation of territory,
							the construction of otherness, and the influence of religious ideas and terminology on
							conceptions of space and peoples, as well as the circumstances under which perceptions
							of peoples and space changed over the course of time.
						</p>
						<p>
							Find out more about our project and the people behind it in this short movie, a
							contribution to the exhibition
							<a class="font-semibold underline" href="https://www.youtube.com/watch?v=JHv7U96k78g">
								Reiternomaden in Europa
							</a>
						</p>
					</AboutDisclosure>
					<!-- prettier-ignore -->
					<AboutDisclosure title="Our sources">
						<p>
							MMP includes ca. 5500 passages from 1150 different texts from 440 different authors,
							covering a broad range of medieval source material (including historiography,
							hagiography, exegesis, charters, geographical works, legislative texts, conciliar
							acts, homilies and annals). We have identified 690 keywords, organised into four
							categories: 1.
							<b>Keywords</b>
							(which include a wider range of ethnic terminology such as gens, patria, then
							attributes, titles, stereotypical traits); 2.
							<b>Ethnonyms</b>;	3.
							<b>Personal names</b>
							(such as important political players); 4.
							<b>Regional and geographical names</b>
							(which include spatial terms, such as mountains, rivers, as well as abstract concepts
							like East and North, and geographical regions that also designated political
							communities). All keywords and passages from Latin and Greek texts have been selected
							are in some way relevant for the significance of the terms and contribute to a better
							understanding of ethnic terminology.
						</p>
						<p>
							Our data includes the
							<b>Case Studies</b>
							and also a broader corpus of data that was generated for the database project
							<a class="font-semibold underline" href="https://www.oeaw.ac.at/imafo/gens/">
								GENS: Group Terminology and Ethnic Nomenclature
							</a>:
							A Semantic Database (Latin Europe c. 400-1200), in the ERC SCIRE - Social Cohesion,
							Identity and Religion in Europe (2007-2013) by Walter Pohl, Cinzia Grifoni and
							Katharina Winckler. The source material of the
							<b>Case Studies</b>
							and the
							<b>GENS Database</b>
							has a slightly different focus: the
							<b>Case Studies</b>
							have been modelled along specific research questions and allow an in-depth study of a
							specific people, region or ethnonym, while the
							<b>GENS Database</b>
							focuses on the meanings of Romanness in the post-imperial West and allows a
							comprehensive selection of early medieval Latin sources on that topic. These terms,
							all in relation to Romanness, can be searched for comprehensively, for example:
							alienigena; civ* roman*; civ* + roman*; gens Christiana/christianorum; gens romana;
							gens + romana; gent* + roman*; gens *orum; gent* + Dei; popul* + gentium; popul* +
							nationum; Romania*; romana* civita*; natio* + gentium
						</p>
					</AboutDisclosure>
					<AboutDisclosure title="Ways to search our data">
						<!-- prettier-ignore -->
						<p>
							MMP is intended to provide a wide overview of how ethnic terminology was employed and
							how perceptions of space were constructed. It allows a qualitative search and
							evaluation of meaning and recurrence of ethnic and spatial terminology until the first
							half of the 13th century. The search is conducted via
							<b>autocomplete</b>.
							Use
							<b>browse the data</b>
							for an overview of all data included. Use the
							<b>side panels</b>
							to access more information about authors and keywords. You can click on the
							<b>colour-coded keywords</b>
							to search for them in the database in a new window, while the
							<b>grey keywords</b>
							bring up works, authors and places in the side bar.
						</p>
						<b>You can search for:</b>
						<!-- prettier-ignore -->
						<ul class="list-disc">
							<li class="font-semibold">
								<NuxtLink
									class="flex w-fit items-center gap-4 rounded p-2 hover:bg-neutral-100"
									:href="{
										path: '/explore/network-graph-visualisation',
										query: {
											author: 24,
										}
									}"
									target="_blank"
								>
									<span>
										The ethnonyms a specific author uses
									</span>
									<ChevronRightIcon class="h-full w-5" />
								</NuxtLink>
							</li>
							Type <b>Jerome</b> into the search bar - all possible searches will appear via autocomplete - and select <b>network graph</b>, then choose what you want to see on the graph: in this case, uncheck everything but <b>author and ethnonyms</b>
							<li class="font-semibold">
								<NuxtLink
									class="flex w-fit items-center gap-4 rounded p-2 hover:bg-neutral-100"
									:href="{
										path: '/explore/network-graph-visualisation',
										query: {
											keyword: 53,
										}
									}"
									target="_blank"
								>
									<span>
										Which peoples are mentioned together?
									</span>
									<ChevronRightIcon class="h-full w-5" />
								</NuxtLink>
							</li>
							Type <b>Dani</b> into the search bar - all possible searches will appear via autocomplete - and uncheck everything but <b>ethnonyms</b> to see the other peoples mentioned in connection with the Danes
							<li class="font-semibold">
								<NuxtLink
									class="flex w-fit items-center gap-4 rounded p-2 hover:bg-neutral-100"
									:href="{
										path: '/explore/search-results',
										query: {
											keyword: [53, 289],
										}
									}"
									target="_blank"
								>
									<span>
										The combinations between ethnonyms and keywords via Union/Intersection
									</span>
									<ChevronRightIcon class="h-full w-5" />
								</NuxtLink>
							</li>
							Put <b>Dani</b> and <b>feritas</b> into the search bar - the terms will be available to select via autocomplete - and you can then see passages containing both (<b>intersection/and</b>) or either (<b>union/or</b>) in the search results, and then visualise the connections between these and other terms in the graph
							<li class="font-semibold">
								<NuxtLink
									class="flex w-fit items-center gap-4 rounded p-2 hover:bg-neutral-100"
									:href="{
										path: '/explore/network-graph-visualisation',
										query: {
											author: [88, 71],
											keyword: 168,
											'query-mode': 'union',
											selection: 'graph-keyword_168',
										}
									}"
									target="_blank"
								>
									<span>
										Comparisons of different authors' use of keywords
									</span>
									<ChevronRightIcon class="h-full w-5" />
								</NuxtLink>
							</li>
							Put <b>Orosius</b>, <b>Einhard</b> and <b>rex</b> into the search bar (the terms will come up via autocomplete and can be selected) and select <b>union (or)</b>, then view them in the graph
							<li class="font-semibold">
								<NuxtLink
									class="flex w-fit items-center gap-4 rounded p-2 hover:bg-neutral-100"
									:href="{
										path: '/explore/search-results',
										query: {
											keyword: [137, 288],
											'query-mode': 'union',
											'date-range': [900, 1200],
										}
									}"
									target="_blank"
								>
									<span>
										The combination of a place name and an ethnonym or a specific region in a specific
										period (time of composition or temporal coverage)
									</span>
									<ChevronRightIcon class="h-full w-5" />
								</NuxtLink>
							</li>
							Put <b>Normannia</b> and <b>Normanni</b> into the search bar (available terms will appear via autocomplete), and set the timeslider to 900 - 1200, select <b>time of composition</b> or <b>temporal coverage</b>, you can then view the resulting passages and a graph of the connections, both as intersection and union
						</ul>
					</AboutDisclosure>
					<AboutDisclosure title="How the data is visualized">
						<!-- prettier-ignore -->
						<p>
							MMP provides a visual representation of the semantic field of ethnic terminology
							(<b>graph</b>),
							a spatial dimension
							(<b>geovisualisation</b>)
							- in which keywords are placed on the map with a 'cone' showing the point of activity
							of the author of a text projecting onto the area they associated with that keyword -
							and permits filtering through two different time-frames
							(<b>time of compostition</b>
							and
							<b>temporal coverage</b>
							of the events described) to show how, for instance, the perception of a specific
							people or keyword changed and varied over the course of time, and from one historical
							context to another. You can also view
							<b>word clouds</b>
							and
							<b>pie charts</b>
							which offer a quantitative perspective to complement the qualitative one offered by
							the other visualisations. These compare the occurrence of the selected keywords in a
							passage or case study with the occurrence of lemmatized keywords according to their
							quantitative occurrence.
						</p>
					</AboutDisclosure>
					<AboutDisclosure title="Who we are">
						<div class="grid grid-cols-2">
							<span>Project Leaders</span>
							<ul class="m-0 p-0">
								<li>
									<a
										href="https://www.oeaw.ac.at/imafo/forschung/historische-identitaetsforschung/mitarbeiterinnen/veronika-wieser/"
										class="underline"
									>
										Veronika Wieser (Imafo / AAS)
									</a>
								</li>
								<li>
									<a
										href="https://www.oeaw.ac.at/imafo/forschung/historische-identitaetsforschung/mitarbeiterinnen/walter-pohl"
										class="underline"
									>
										Walter Pohl (Imafo / AAS)
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
								<li>Marc Schmitz</li>
							</ul>
						</div>
					</AboutDisclosure>
					<!-- prettier-ignore -->
					<AboutDisclosure title="Our events and publications">
						<p>
							In preparation: collected volume 'Mapping Medieval Peoples: New Approaches to Ethnic
							Identity and Space, 400-1400CE', ed. Laura Gazzoli, Veronika Wieser, Katharina
							Winckler (Submitted, 2024)
						</p>
						<p>
							<b>Workshop</b>
							&nbsp;
							<a
								class="underline"
								href="https://www.oeaw.ac.at/imafo/veranstaltungen/detail/ab-aquilone-conceptions-of-space-and-identities-in-europes-far-north-in-the-middle-ages"
							>'Ab aquilone: conceptions of space and identities in Europe's far north in the
								middle ages'</a>,
							June 10, 2022, organised by Laura Gazzoli
						</p>
						<p>
							<b>Workshop</b>
							&nbsp;
							<a
								class="underline"
								href="https://www.oeaw.ac.at/imafo/veranstaltungen/detail/ethnonyms-and-the-order-of-space-in-the-frankish-realms-6th-9th-c"
							>'Ethnonyms and the order of space in the Frankish realms (6th to 9th c.)'</a>,
							November 4, 2022, organised by Katharina Winckler
						</p>
					</AboutDisclosure>
					<!-- prettier-ignore -->
					<AboutDisclosure title="Our resources">
						<h2>Select Bibliography</h2>
						<p>
							Many of our texts are taken from the
							<i>Digital Monumenta Germaniae historica</i>:
							<a class="font-semibold underline" href="https://www.dmgh.de/">dmgh.de</a>
							as well as the
							<i>Corpus Christianorum: </i>
							<a href="https://www.corpuschristianorum.org/" class="font-semibold underline">corpuschristianorum.org</a>  and the Loeb Classical Library <a class="font-semibold underline" href="https://www.loebclassics.com/">loebclassics.com</a>
						</p>
						<p>Other editions, as well as translations used, are cited here:</p>
						<p>Abbo of Fleury, <i>Life of St. Eadmund,</i> ed. by Michael Winterbottom, in <i>Three Lives of English Saints</i> (Toronto: Centre for Medieval Studies of the Pontifical Institute of Toronto, 1972), pp. 66-87 </p>
						<p>
							Adam of Bremen,
							<i>History of the Archbishops of Hamburg-Bremen</i>, trans. by Francis J. Tschan, with a new introduction and selected bibliography by Timothy Reuter, 2<sup>nd</sup>
							edn (New York: Columbia University Press, 2002)
						</p>
						<p>
							Aethicus Ister, <i>The Cosmography of Aethicus Ister,</i> ed. and trans. Michael W. Herren (Turnhout: Brepols, 2011)
						</p>
						<p>
							Alcuin of York, <i>Letters,</i> trans. Stephen Allott <i>(Alcuin of York, c. AD 732 to 804: His Life and Letters)</i> (York: William Sessions, 1974)
						</p>
						<p>
							Alcuin of York, <i>Life of Willibrord,</i> trans. A. Grieve (1932), <a class="font-semibold underline" href="https://sourcebooks.fordham.edu/basis/alcuin-willbrord.asp">sourcebooks.fordham.edu/basis/alcuin-willbrord.asp</a>
						</p>
						<p>
							Arnobius, <i>The Case against the Pagans,</i> Ancient Christian Writers, 2 vols. (New York/Ramsey, NJ: Newman Press, 1949)
						</p>
						<p>
							Augustine, <i>De excidio urbis Romae sermo,</i> ed. and trans. by Marie Vianney O'Reilly, Catholic University of America Patristic Studies 89 (Washington D. C.: Catholic University of America Press, 1955)
						</p>
						<p>Augustine, <i>The City of God against the Pagans,</i> ed. and trans. R. W. Dyson (Cambridge: Cambridge University Press, 1998)</p>
						<p>Bede, <i>The Commentary on the Seven Catholic Epistles,</i> trans. David Hurst (Piscataway: Gorgias Press, 1985)</p>
						<p>
							Bede, <i>The Explanation of the Apocalypse,</i> trans. E. Marshall (Oxford and London: James Parker and Co., 1878)
						</p>
						<p>
							Bede, <i>Historia ecclesiastica gentis Anglorum: Ecclesiastical History of the English
							People</i>, ed. and trans. by Bertram Colgrave and R. A. B. Mynors (Oxford: Oxford
							University Press, 1969)
						</p>
						<p>
							Bede, <i>Homilies on the Gospels, Volume 1: Advent to Lent,</i> Trans. Lawrence T. Martin and David Hurst (Piscataway, NJ: Gorgias Press, 2010)
						</p>
						<p>
							Bede, <i>On the Song of Songs and Selected Writings,</i> trans. by Arthur Holder, Classics of Western Spirituality (New York/Mahwah, NJ: Paulist Press, 2011)
						</p>
						<p>
							Bede, <i>On the Tabernacle,</i> trans. by Arthur G. Holder, Liverpool Translated Texts for Historians (Liverpool: Liverpool University Press, 1994)
						</p>
						<p>
							Bede, <i>The Reckoning of Time,</i> trans. by Faith Wallis, Liverpool Translated Texts for Historians (Liverpool: Liverpool University Press, 1999)
						</p>
						<p>
							Boniface, <i>The Letters of St Boniface,</i> trans. by Ephraim Emerton (New York: Norton, 1976)
						</p>
						<p>
							Burgess, R. W., ed. and trans., <i>The Chronicle of Hydatius and The Consularia Constantinopolitana: two contemporary accounts of the final years of the Roman empire</i> (Oxford: Oxford University Press, 2017)
						</p>
						<p>
							<i>Encomium Emmae Reginae,</i> ed. and trans. by Alistair Campbell, with a supplementary
							introduction by Simon Keynes, 2<sup>nd</sup> edn (Cambridge: Cambridge University Press, 1998)
						</p>
						<p>
							Gertz, M. Cl., ed., <i>Vitae sanctorum Danorum</i> (Copenhagen: G. E. C. Gad, 1908–12)
						</p>
						<p>
							Godman, Peter, ed. and trans., <i>Poetry of the Carolingian Renaissance</i> (London: Duckworth, 1985)
						</p>
						<p>
							Gregory the Great, <i>Dialogues,</i> trans. Odo John Zimmerman, The Fathers of the Church 39 (Washington D. C.: Catholic University of America Press, 1959)
						</p>
						<p>
							<i>Historia Norwegie</i>, ed. by Inger Ekrem and Lars Boje Mortensen and trans. by Peter
							Fisher (Copenhagen: Museum Tusculanum Press, 2003)
						</p>
						<p>
							Isidore of Seville, <i>De ecclesiasticis officiis,</i> trans. by Thomas L. Knoebel, Ancient Christian Writers (New York/Mahwah, NJ: The Newman Press, 2008)
						</p>
						<p>
							Isidore of Seville, <i>The Etymologies,</i> ed. and trans. by Stephen A. Barney, W. J. Lewis, J. A. Beach, Oliver Berghof (Cambridge: Cambridge University Press, 2006)
						</p>
						<p>
							Isidore of Seville, <i>History of the Kings of the Goths,</i> Vandals, and Suevi, trans. Guido Donini and Gordon B. Ford (Leiden: E. J. Brill, 1966)
						</p>
						<p>
							Jordanes, <i>Romana and Getica,</i> trans. Peter van Nuffelen and Lieve van Hoof, Translated Texts for Historians 75 (Liverpool: Liverpool University Press, 2020)
						</p>
						<p>
							King, P. D., trans., <i>Charlemagne: Translated Sources</i> (Kendal, Cumbria: P. D. King, 1987)
						</p>
						<p>
							Lampert of Hersfeld, <i>The Annals of Lampert of Hersfeld,</i> trans. by I. S. Robinson (Manchester: Manchester University Press, 2016)
						</p>
						<p>
							Liutprand of Cremona, <i>The Complete Works of Liutprand of Cremona,</i> trans. by Paolo Squatriti, Medieval Texts in Translation (Washington, D.C.: Catholic University of America Press, 2007)
						</p>
						<p>
							Nelson, Janet L., trans., <i>The Annals of St Bertin</i> (Manchester: Manchester University Press, 1991)
						</p>
						<p>
							Orosius, <i>Seven Books of History against the Pagans,</i> trans. A. T. Fear, Translated Texts for Historians 54 (Liverpool: Liverpool University Press, 2010)
						</p>
						<p>
							Salvian of Marseilles, <i>The Writings of Salvian,</i> the Presbyter, trans. Jeremiah F. O’Sullivan (Washington, D. C.: Catholic University of America Press, 1947)
						</p>
						<p>
							Saxo Grammaticus, <i>Gesta Danorum: The History of the Danes</i>, ed. by Karsten
							Friis-Jensen, trans. by Peter Fisher (Oxford: Oxford University Press, 2015)
						</p>
						<p>
							Scholz, Bernhard Walter, and Rogers, Barbara, trans., <i>Royal Frankish annals and Nithard's Histories</i> (Ann Arbor: University of Michigan Press, 1972)
						</p>
						<p>
							Theodoricus of Nidaros, <i>De antiquitate regum Norwagensium: On the Old Norwegian Kings</i>,
							ed. and trans. by Egil Kraggerud (Oslo: Novus Forlag, 2018)
						</p>
						<p>
							Thietmar of Merseburg, <i>Ottonian Germany: The Chronicon of Thietmar of Merseburg,</i> translated and annotated by David A. Warner (Manchester: Manchester University Press, 2001)
						</p>
						<p>
							Venantius Fortunatus, <i>Personal and Political Poems,</i> trans. by Judith George, Translated Texts for Historians 23 (Liverpool: Liverpool University Press, 1995)
						</p>
						<p>
							Victor of Vita, <i>History of the Vandal Persecution,</i> trans. John Moorhead, Translated Texts for Historians 10 (Liverpool: Liverpool University Press, 1992)
						</p>
						<p>
							Vincent Kadłubek, <i>Chronica Polonorum</i>, ed. by Marianus Plezia, Pomniki dziejowe
							Polski/Monumenta Poloniae historica, Nova series 11 (Kraków: Secesja, 1994)
						</p>
						<p>
							Widukind of Corvey, <i>Deeds of the Saxons,</i> trans. by Bernard S. Bacharach and David S. Bacharach (Washington D.C.: Catholic University of America Press, 2014)
						</p>
						<p>
							William of Malmesbury, <i>Gesta regum Anglorum: The Deeds of the English Kings</i>, ed. and
							trans. by R. A. B. Mynors, completed by R. M. Thompson and M. Winterbottom (Oxford:
							Oxford University Press, 1998)
						</p>
						<h2>Map layer sources</h2>
						<p>
							Digital Atlas of Roman Empire &#169; 2020 Johan Åhlfeldt: <a class="font-semibold underline" href="https://imperium.ahlfeldt.se/">imperium.ahlfeldt.se</a>
						</p>
						<p>
							Roman Roads Network &#169; DARMC Scholarly Data Series 2013-5
						</p>
						<p>
							Kingdom layer	&#169; Erik Goosmann
						</p>
						<p>
							Mappa Mundi Cartography: <a class="font-semibold underline" href="https://www.mappamundi-cartography.com/">mappamundi-cartography.com</a>
						</p>
					</AboutDisclosure>
					<AboutDisclosure title="Contact">
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
					</AboutDisclosure>
				</div>
			</div>
		</div>
	</MainContent>
</template>
