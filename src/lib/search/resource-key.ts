import type { Resource, ResourceKey, ResourceKind } from "@/api";
import { isNonEmptyString } from "@/lib/is-nonempty-string";

const resourceKinds: Array<ResourceKind> = ["autor", "keyword", "ort", "stelle", "text", "usecase"];

export type ResourceIdentifier = { kind: ResourceKind; id: Resource["id"] };

export function createResourceKey(params: ResourceIdentifier): ResourceKey {
	return [params.kind, params.id].join("_") as ResourceKey;
}

export function splitResourceKey(key: ResourceKey): ResourceIdentifier {
	const [kind, id] = key.split("_");
	return { kind: kind as ResourceKind, id: Number(id) };
}

export function isResourceKey(value: unknown): value is ResourceKey {
	if (typeof value !== "string") return false;

	const [kind, id] = value.split("_");

	if (!isNonEmptyString(id)) return false;
	if (Number.isNaN(Number(id))) return false;

	if (!isNonEmptyString(kind)) return false;
	if (!resourceKinds.includes(kind as ResourceKind)) return false;

	return true;
}
