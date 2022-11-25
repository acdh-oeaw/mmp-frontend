import type { KeywordType, ResourceKind } from '@/api';

export const kindLabels: Record<ResourceKind, string> = {
  autor: 'Author',
  usecase: 'Case study',
  keyword: 'Keyword',
  ort: 'Place',
  stelle: 'Passage',
  text: 'Text',
};

export const keywordTypeLabels: Record<KeywordType, string> = {
  Ethnonym: 'Ethnonym',
  Keyword: 'Keyword',
  Name: 'Name',
  Region: 'Region',
  unclear: 'unclear',
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
