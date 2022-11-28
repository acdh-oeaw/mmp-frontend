import type { GraphNodeType } from '@/lib/network-graph/network-graph.types';
import { keywordTypeLabels, kindLabels } from '@/lib/search/search.config';

export const nodeColors: Record<GraphNodeType, string> = {
  Keyword: '#039be5', // blue darken-1
  Ethnonym: '#00897b', // teal darken-1
  Name: '#ffb300', // amber darken-1
  Region: '#43a047', // green darken-1
  unclear: '#808080', // grey
  autor: '#ff0000', // red
};

export const nodeTypeLabels: Record<GraphNodeType, Plurals> = {
  Keyword: keywordTypeLabels.Keyword,
  Ethnonym: keywordTypeLabels.Ethnonym,
  Name: keywordTypeLabels.Name,
  Region: keywordTypeLabels.Region,
  unclear: keywordTypeLabels.unclear,
  autor: kindLabels.autor,
};
