import type { GeometryCollection, Point, Polygon } from 'geojson';

import type { Normalized } from '@/api/types';

export type UseCase = {
  id: number;

  /** Title. */
  title: string;
  /** Description. */
  description?: string | null;

  /** Principal investigator. */
  principal_investigator: string;
  /** Norm-ID of the principal investigator. */
  pi_norm_id: string;

  /** Story Map. */
  story_map?: string | null;
  /** Knightlab Story Maps. */
  knightlab_stoy_map: Array<Story>;

  /** Additional map layer. Needs to match predefined allowed layer names, e.g. '800'. */
  custom_layer?: string | null;
};

export type UseCaseNormalized = Normalized<UseCase, 'knightlab_stoy_map'>;

export type Author = Omit<
  {
    id: number;

    /** Name in German. */
    name: string;
    /** Name in Latin. */
    name_lat: string;
    /** Name in English. */
    name_en: string;
    /** Name in French. */
    name_fr: string;
    /** Name in Italian. */
    name_it: string;
    /** Name in Greek. */
    name_gr: string;

    /** Century or centuries in which the author was active. */
    jahrhundert: string;

    /** Birth or earliest year of activity. */
    start_date: string;
    /** Birth or earliest year of activity. */
    start_date_year?: number | null;
    /** Death or end of activity (year). */
    end_date: string;
    /** Death or end of activity (year). */
    end_date_year?: number | null;

    /** Place associated with author (birth or activity). */
    ort?: Place | null;

    /** Comment. */
    kommentar?: string | null;
    /** Original data. */
    orig_data_csv?: string | null;

    /** ID in GND. */
    gnd_id: string;

    /** Legacy ID. */
    legacy_id: string;
    /** Legacy ID from GENS database. */
    legacy_pk?: number | null;
  },
  'legacy_id' | 'legacy_pk' | 'orig_data_csv'
>;

export type AuthorNormalized = Normalized<Author, 'ort'>;

export type Place = Omit<
  {
    id: number;

    /** Name in English. */
    name: string;
    /** Name in ancient sources. */
    name_antik: string;
    /** Name in German. */
    name_de: string;
    /** Name in French. */
    name_fr: string;
    /** Name in Italian. */
    name_it: string;
    /** Name in Greek. */
    name_gr: string;

    /** Longitude. */
    long?: number | null;
    /** Latitude. */
    lat?: number | null;
    /** Coordinates. */
    coords?: Point | null;
    /** Approximate localisation of an area. */
    fuzzy_geom?: GeometryCollection | null;

    /**
     * Type of place.
     *
     * Allowed values are defined in the "place_art" SkosCollection.
     * @see '/vocabs-ac/specific-concept-ac/place_art'
     */
    art?: SkosConcept | null;
    /**
     * Category of place.
     *
     * Allowed values are defined in the "kategorie" SkosCollection.
     * @see '/vocabs-ac/specific-concept-ac/kategorie'
     */
    kategorie?: SkosConcept | null;

    /** Comment. */
    kommentar?: string | null;
    /** Original data. */
    orig_data_csv?: string | null;

    /** Norm-ID. */
    norm_id: string;

    /** Legacy ID. */
    legacy_id: string;
    /** Legacy ID from GENS database. */
    legacy_pk?: number | null;
  },
  'legacy_id' | 'legacy_pk' | 'orig_data_csv'
>;

export type PlaceNormalized = Normalized<Place, 'art' | 'kategorie'>;

export type Keyword = Omit<
  {
    id: number;

    /** Label. */
    stichwort: string;
    /** Label in Greek. */
    name_gr: string;

    /** Type of keyword. */
    art: KeywordType;
    /** Variant forms, separated by semicolon. */
    varianten?: string | null;
    /** Root. */
    wurzel: string;
    /** Related keywords. */
    related_keyword: Array<Keyword>;

    /** Comment. */
    kommentar?: string | null;
    /** Original data. */
    orig_data_csv?: string | null;

    /** Legacy ID. */
    legacy_id: string;
    /** Legacy ID from GENS database. */
    legacy_pk?: number | null;
  },
  'legacy_id' | 'legacy_pk' | 'orig_data_csv'
>;

export type KeywordNormalized = Normalized<Keyword, 'related_keyword'>;

export type KeywordType = 'Keyword' | 'Name' | 'Ethnonym' | 'Region' | 'unclear';

export type Passage = Omit<
  {
    id: number;

    /** Display label. */
    display_label?: string | null;

    /** Text. */
    text?: Text | null;
    /** Summary. */
    summary?: string | null;
    /** Text of the passage in the original language. */
    zitat?: string | null;
    /** Chapter and/or page numbers for the passage. */
    zitat_stelle?: string | null;
    /** Translation. */
    translation?: string | null;
    /** A lemmatised version of the passage. */
    lemmata: Lemmata | null;

    /** Keywords asssociated with the passage. */
    key_word: Array<Keyword>;
    /** Places of composition. */
    ort: Array<Place>;
    /** Associated usecases. */
    use_case: Array<UseCase>;

    /** Start date or earliest possible date (year). */
    start_date?: number | null;
    /** End date or last possible date (year). */
    end_date?: number | null;

    /** Comment. */
    kommentar?: string | null;
    /** Original data. */
    orig_data_csv?: string | null;

    /** Legacy ID. */
    legacy_id: string;
    /** Legacy ID from GENS database. */
    legacy_pk?: number | null;
  },
  'legacy_id' | 'legacy_pk' | 'orig_data_csv' | 'lemmata'
>;

export type PassageNormalized = Normalized<Passage, 'key_word' | 'ort' | 'use_case'>;

type Lemmata = {
  orig_text: string;
  tokens: Array<string>;
  processed_text: Array<{ token: string; pos: string; lemma: string }>;
};

export type Text = Omit<
  {
    id: number;

    /** Title. */
    title: string;
    /** Alternative title(s) of the text. */
    alt_title: string;
    /** Authors. */
    autor: Array<Author>;
    /**
     * Language of the original text.
     *
     * @default 'lat'
     */
    text_lang: string;

    /** Century. */
    jahrhundert: string;
    /** Earliest possible date of composition (year). */
    start_date: string;
    /** Last possible date of composition (year). */
    end_date: string;
    /** Not before year. */
    not_before?: number | null;
    /** Not after year. */
    not_after?: number | null;

    /** Edition. */
    edition: string;
    /**
     * Genre.
     *
     * Allowed values are defined in the "art" SkosCollection.
     * @see '/vocabs-ac/specific-concept-ac/art'
     */
    art?: SkosConcept | null;
    /** Places of composition. */
    ort: Array<Place>;

    /** Comment. */
    kommentar?: string | null;
    /** Original data. */
    orig_data_csv?: string | null;

    /** Legacy ID. */
    legacy_id: string;
    /** Legacy ID from GENS database. */
    legacy_pk?: number | null;
  },
  'legacy_id' | 'legacy_pk' | 'orig_data_csv'
>;

export type TextNormalized = Normalized<Text, 'autor' | 'art' | 'ort'>;

/** Currently not exposed via api. */
type _Event = {
  id: number;

  /** Label. */
  title?: string | null;
  /** Description. */
  description?: string | null;

  /** Start date or earliest possible date. */
  start_date?: number | null;
  /** End date or last possible date. */
  end_date?: number | null;
  /** Specific year. */
  written_date?: string | null;

  /** Associated usecases. */
  use_case: Array<UseCase>;
};

/** Spatial Coverage of a Keyword bound to a specifc source document. */
export type SpatialCoverage = {
  id: number;

  /** Passages associated with coverage. */
  stelle: Array<Passage>;
  /** Keyword associated with coverage. */
  key_word?: Keyword | null;

  /** Approximate localisation of an area. */
  fuzzy_geom?: Polygon | null;
  /** Points and lines. */
  geom_collection?: GeometryCollection | null;
  /** Uncertainty of location on a scale from 1 (very secure) to 10 (very insecure). */
  fuzzyness: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  /**
   * Display labels for coverage.
   *
   * @default true
   */
  show_labels: boolean;

  /** Comment. */
  kommentar?: string | null;
};

export type SpatialCoverageNormalized = Normalized<SpatialCoverage, 'stelle' | 'key_word'>;

type PlaceGeoJsonProperty = {
  id: Place['id'];
  name: Place['name'];
  lat?: number | null;
  lng?: number | null;
  art?: {
    id: SkosConcept['id'];
    label: SkosConcept['pref_label'];
  } | null;
};

export type SpatialCoverageGeoJsonProperties = {
  /** Keyword associated with coverage. */
  key_word?: KeywordNormalized | null;
  /** Uncertainty of location on a scale from 1 (very secure) to 10 (very insecure). */
  fuzzyness: SpatialCoverage['fuzzyness'];
  stelle: Array<Pick<PassageNormalized, 'id' | 'start_date' | 'end_date' | 'display_label'>>;
  texts: Array<{
    id: Text['id'];
    title: Text['title'];
    places: Array<PlaceGeoJsonProperty>;
    authors: Array<{
      id: Author['id'];
      name: Author['name'];
      place?: PlaceGeoJsonProperty | null;
    }>;
  }>;
  places: Array<PlaceGeoJsonProperty>;
};

/**
 * @see https://github.com/acdh-oeaw/acdh-django-vocabs
 */
export type SkosConcept = Omit<
  {
    /** NOTE: Omitted from payloads because of `HyperlinkedModelSerializer`. */
    id: number;
    url: string;

    /** Preferred label for concept. */
    pref_label: string;
    /**
     * Language of preferred label.
     *
     * @default 'en'
     */
    pref_label_lang: string;
    /** Concept scheme to which this concept belongs. */
    scheme: SkosConceptScheme;
    /** Is this concept a top concept of concept scheme? */
    top_concept?: boolean | null;
    /** Collections this concept is a member of. */
    collection: Array<SkosCollection>;
    /** A notation is a unique string used to identify the concept in the current vocabulary. */
    notation: string;
    /** Concept with a broader meaning which this concept inherits from. */
    broader_concept?: SkosConcept | null;
    narrower_concepts?: Array<SkosConcept> | null;

    /** An associative relationship between two concepts. */
    related: string;
    /** External concept with a broader meaning. */
    broad_match: string;
    /** External concept with a narrower meaning. */
    narrow_match: string;
    /** External concept which can be used interchangeably and has the exact same meaning. */
    exact_match: string;
    /** External concept which has an associative relationship with this concept. */
    related_match: string;
    /** External concept with a similar meaning. */
    close_match: string;

    legacy_id: string;
    /** Persons or organisations which created this concept, separated by semicolon. */
    creator: string;
    /** Persons or organisations which made contributions to this concept, separated by semicolon. */
    contributor: string;
    /** Does this concept need to be reviewed? */
    needs_review?: boolean | null;
    date_created: IsoDateTimeString;
    date_modified: IsoDateTimeString;
    created_by?: User | null;
  },
  'top_concept' | 'needs_review'
>;

export type SkosConceptNormalized = Normalized<
  SkosConcept,
  'scheme' | 'collection' | 'broader_concept' | 'narrower_concepts' | 'created_by'
>;

/**
 * @see https://github.com/acdh-oeaw/acdh-django-vocabs
 */
export type SkosConceptScheme = {
  /** NOTE: Omitted from payloads because of `HyperlinkedModelSerializer`. */
  id: number;
  url: string;

  /** URI to unambiguously identify this Concept Scheme. */
  identifier: UrlString;
  /** Title. */
  title: string;
  /**
   * Language of title.
   *
   * @default 'en'
   */
  title_lang: string;

  /** Persons or organisations responsible for creating this concept scheme, separated by semicolon. */
  creator: string;
  /** Persons or organisations which made contributions to the vocabulary, separated by semicolon. */
  contributor: string;
  /** Languages used in concept scheme, separated by semicolon.  */
  language: string;
  /** Subjects of the vocabulary, separated by semicolon. */
  subject: string;
  /** Current version. */
  version: string;
  /** Organisation responsible for making the vocabulary available. */
  publisher: string;
  /** Information about license applied to the vocabulary. */
  license: string;
  /** Person or organisation which owns the rights for the vocabulary. */
  owner: string;
  /** Related resource or project. */
  relation: UrlString;
  /** Spatial or temporal frames which the vocabulary relates to, separated by semicolon. */
  coverage: string;

  legacy_id: string;
  date_created: IsoDateTimeString;
  date_modified: IsoDateTimeString;
  /** Date of official publication of this Concept Scheme. */
  date_issued?: IsoDateTimeString | null;
  created_by?: User | null;
  curator: User;
};

export type SkosConceptSchemeNormalized = Normalized<SkosConceptScheme, 'curator' | 'created_by'>;

/**
 * @see https://github.com/acdh-oeaw/acdh-django-vocabs
 */
export type SkosCollection = {
  /** NOTE: Omitted from payloads because of `HyperlinkedModelSerializer`. */
  id: number;
  url: string;

  /** Label. */
  name: string;
  /**
   * Language of label.
   *
   * @default 'en'
   */
  label_lang: string;
  /** Concept Scheme this collection belongs to */
  scheme: SkosConceptScheme;

  legacy_id: string;
  /** Persons or organisations which created this collection, separated by semicolon. */
  creator: string;
  /** Persons or organisations which made contributions to this collection, separated by semicolon. */
  contributor: string;
  date_created: IsoDateTimeString;
  date_modified: IsoDateTimeString;
  created_by?: User | null;
};

export type SkosCollectionNormalized = Normalized<SkosCollection, 'scheme' | 'created_by'>;

type User = {
  id: number;

  username: string;
  /**
   * Other fields omitted.
   *
   * @see https://docs.djangoproject.com/en/4.1/ref/contrib/auth/#user-model
   */
};

export type ModelingProcess = {
  id: number;

  created_at: IsoDateTimeString;
  process_start: IsoDateTimeString;
  process_end: IsoDateTimeString;
  /** @default 'gensim.models.LdaModel' */
  modeling_type: string;
  param: Record<string, unknown>;
};

export type Topic = {
  id: number;

  created_at: IsoDateTimeString;
  word: Array<{ [word: string]: number }>;
  title: string;
  weight?: number | null;
  process: ModelingProcess;
  topic_index?: number | null;
};

export type TopicNormalized = Normalized<Topic, 'process'>;

export type TextTopicRelation = {
  id: number;

  text?: (PassageNormalized & { lemmata: Lemmata }) | null;
  topic?: TopicNormalized | null;
  weight?: number | null;
};

export type TextTopicRelationNormalized = Normalized<TextTopicRelation, 'text' | 'topic'>;

/**
 * @see https://github.com/acdh-oeaw/django-story-map
 */
export type Story = {
  id: number;

  title: string;
  attribution?: string | null;
  /** @default true */
  call_to_action: boolean;
  call_to_action_text?: string | null;
  /** @default 'en' */
  language: string;
  /** @default '#5f9468' */
  map_background_color: string;
  map_subdomains?: string | null;
  map_type?: string | null;
  zoomify_path?: string | null;
  zoomify_height?: number | null;
  zoomify_width?: number | null;
  zoomify_attribution?: string | null;
};

export type StoryNormalized = Story;

export type Slide = {
  id: number;

  story: Story;
  /** Slide index. */
  order_nr: number;
  location_lat?: number | null;
  location_lng?: number | null;
  /** @default 4 */
  location_zoom: number;
  /** @default 48 */
  location_icon_size_l: number;
  /** @default 48 */
  location_icon_size_w: number;
  /** @default true */
  location_line: boolean;
  text_headline: string;
  text_text?: string | null;
  date?: IsoDateTimeString | null;
  media_caption?: string | null;
  media_credit?: string | null;
  media_url?: string | null;
};

export type SlideNormalized = Normalized<Slide, 'story'>;
