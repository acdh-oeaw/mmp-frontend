import type { Resource, ResourceKey, ResourceKind } from '@/api';

type ResourceIdentifier = { kind: ResourceKind; id: Resource['id'] };

export function createResourceKey(params: ResourceIdentifier): ResourceKey {
  return [params.kind, params.id].join('__') as ResourceKey;
}

export function splitResourceKey(key: ResourceKey): ResourceIdentifier {
  const [kind, id] = key.split('__') as [ResourceKind, Resource['id']];
  return { kind, id };
}
