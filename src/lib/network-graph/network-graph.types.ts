import type { SimulationLinkDatum, SimulationNodeDatum } from 'd3';

import type { KeywordType, ResourceKind } from '@/api';

declare module 'force-graph' {
  type GraphNode = { kind: 'autor' } | { kind: 'keyword'; type: KeywordType };

  interface NodeObject extends GraphNode {
    // id: string;
    label: string;
  }
  interface LinkObject {
    id: string;
  }
}

interface GraphNodeBase extends SimulationNodeDatum {
  id: string;
  label: string;
  kind: ResourceKind;
}

interface GraphNodeAuthor extends GraphNodeBase {
  kind: 'autor';
}

interface GraphNodeKeyword extends GraphNodeBase {
  kind: 'keyword';
  type?: KeywordType;
}

type GraphNode = GraphNodeAuthor | GraphNodeKeyword;

interface GraphEdge extends SimulationLinkDatum<GraphNode> {
  id: string;
  // source: GraphNode['id'];
  // target: GraphNode['id'];
}

export type GraphData = {
  nodes: Array<GraphNode>;
  edges: Array<GraphEdge>;
};
