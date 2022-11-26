import type { KeywordType, ResourceKind } from '@/api';

type Plurals = Pick<Record<Intl.LDMLPluralRule, string>, 'one' | 'other'>;

export const kindLabels: Record<ResourceKind, Plurals> = {
  autor: { one: 'Author', other: 'Authors' },
  usecase: { one: 'Case study', other: 'Case studies' },
  keyword: { one: 'Keyword', other: 'Keywords' },
  ort: { one: 'Place', other: 'Places' },
  stelle: { one: 'Passage', other: 'Passages' },
  text: { one: 'Text', other: 'Texts' },
};

export const keywordTypeLabels: Record<KeywordType, Plurals> = {
  Ethnonym: { one: 'Ethnonym', other: 'Ethnonyms' },
  Keyword: { one: 'Keyword', other: 'Keywords' },
  Name: { one: 'Name', other: 'Names' },
  Region: { one: 'Region', other: 'Regions' },
  unclear: { one: 'unclear', other: 'unclear' },
};

export const colors: Record<ResourceKind, string> = {
  autor: 'red lighten-3',
  stelle: 'teal lighten-4',
  keyword: 'blue lighten-4',
  usecase: 'amber lighten-3',
  ort: 'green lighten-3',
  text: 'purple lighten-3',
};

export const keywordColors: Record<KeywordType, string> = {
  Keyword: 'blue lighten-4',
  Ethnonym: 'teal lighten-4',
  Name: 'amber lighten-4',
  Region: 'green lighten-4',
  unclear: 'grey',
};

// https://github.com/acdh-oeaw/mmp/blob/master/archiv/endpoint_views.py#L17
export const minYear = -300;
export const maxYear = 1500;
