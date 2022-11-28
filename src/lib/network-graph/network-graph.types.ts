import type { SimulationLinkDatum, SimulationNodeDatum } from 'd3';

import type { KeywordType, ResourceKind } from '@/api';

export type GraphNodeType = KeywordType | Extract<ResourceKind, 'autor'>;

declare module 'force-graph' {
  type GraphNode = { kind: 'autor' } | { kind: 'keyword'; type: KeywordType };

  interface NodeObject {
    // id: string;
    label: string;
    type: GraphNodeType;
  }
  interface LinkObject {
    id: string;
  }
}

export interface GraphNode extends SimulationNodeDatum {
  id: string;
  label: string;
  type: GraphNodeType;
}

export interface GraphEdge extends SimulationLinkDatum<GraphNode> {
  id: string;
  // source: GraphNode['id'];
  // target: GraphNode['id'];
}

export type GraphData = {
  nodes: Array<GraphNode>;
  edges: Array<GraphEdge>;
};
