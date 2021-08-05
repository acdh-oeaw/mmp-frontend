<template>
  <!-- eslint-disable-next-line vue/max-attributes-per-line -->
  <div>
    <v-parallax
      src="@/assets/europa.jpg"
      class="home-parallax text-center home-head"
      height="700"
    >
    <div class="gradient-bg parallax-wrapper">
      <v-row align="center" justify="center">
        <v-col cols="12">
          <span class="home-title">Mapping Medieval Peoples</span>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <p class="text-subtitle-1">
            {{ $t('subhead') }}
          </p>
          <p class="text-subtitle-1">
            {{ $t('subsubhead') }}
          </p>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="5" sm="3">
          <v-btn large block color="secondary">{{ $t('search') }}</v-btn>
          <span class="button-subtitle">
            {{ $t('analyses') }}
          </span>
        </v-col>
        <v-col cols="5" sm="3">
          <p>
            <v-btn large block color="primary" v-html="$t('read')" />
            <span class="button-subtitle">
              {{ $t('casestudy') }}
            </span>
          </p>
        </v-col>
      </v-row>
    </div>
    </v-parallax>
    <v-row justify="center" class="home-content">
      <v-col cols="12" md="6">
        <p class="text-h7 study-surtitle">CASE STUDY &nbsp;&nbsp;&bull;&nbsp;&nbsp; Laura Gazzoli</p>
        <p class="text-h4">Mapping Morals: Peoples, Faith and Virtue in Europe’s North.</p>
        <p>Eine wunderbare Heiterkeit hat meine ganze Seele eingenommen, gleich den süßen Frühlingsmorgen, die ich mit ganzem Herzen genieße. Ich bin allein und freue mich meines Lebens in dieser Gegend, die für solche Seelen geschaffen ist wie die meine. Ich bin so glücklich, mein Bester, so ganz in dem Gefühle von ruhigem Dasein versunken, daß meine Kunst darunter leidet.</p>
        <p>Ich könnte jetzt nicht zeichnen, nicht einen Strich, und bin nie ein größerer Maler gewesen als in diesen Augenblicken.</p>
        <p>Wenn das liebe Tal um mich dampft, und die hohe Sonne an der Oberfläche der undurchdringlichen Finsternis meines Waldes ruht, und nur einzelne Strahlen sich in das innere Heiligtum stehlen, ich dann im hohen Grase am fallenden Bache liege, und näher an der Erde tausend mannigfaltige Gräschen mir merkwürdig werden; wenn ich das Wimmeln der kleinen Welt zwischen Halmen, die unzähligen, unergründlichen Gestalten der Würmchen, der Mückchen näher an meinem Herzen fühle, und fühle die Gegenwart des Allmächtigen, der uns nach seinem Bilde schuf, das Wehen des Alliebenden, der uns in ewiger Wonne schwebend trägt und erhält; mein Freund! Wenn's dann um meine Augen dämmert, und die Welt um mich her und der Himmel ganz in meiner Seele ruhn wie die Gestalt einer</p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'Home',
};
</script>

<style lang="css">
  .button-subtitle {
    font-size: 1rem;
  }
  .gradient-bg {
    background: rgb(15, 18, 38);
    background: linear-gradient(180deg, rgba(15, 18, 38, 1) 25%, rgba(15, 18, 38, 0.3) 100%);
  }
  .home-content {
    margin-top: 50px;
  }
  .home-head div.v-parallax__content {
    padding: 0;
  }
  .home-title {
    font-family: "Times New Roman";
    text-decoration-line: underline;
    text-underline-offset: 3px;
    text-decoration-thickness: 3px;
  }
  .parallax-wrapper {
    padding-top: 200px;
    padding-bottom: 100px;
    font-size: 4em;
  }
  .study-surtitle {
    color: grey;
  }
</style>

<i18n>
{
  "en": {
    "subhead": "In the turbulent world of the early Middle Ages, ethnicity became a key resource in the reorganization of the political landscape. Mapping Medieval Peoples (MMP) proposes an innovative technical solution to analyze and visualize the ‘mental maps’ and the semantic fields that emerge from the analysis of late antique and early medieval source material.",
    "subsubhead": "We attempt to reconstruct ‘mental maps’ of a world of peoples, and will offer insights into the interplay between ethnonyms, religious terms, as well as attributes, traits and stereotypes, thus surveying the language employed to create ethnic entities and to distinguish them from each other.",
    "search": "Search our Data",
    "read": "Read &bdquo;Spain and the Bible&ldquo;",
    "analyses": "For Interactive Analyses",
    "casestudy": "A Case Study"
  }
}
</i18n>
