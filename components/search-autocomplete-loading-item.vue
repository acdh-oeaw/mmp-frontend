<script lang="ts" setup>
import { computed, watch } from "vue";

import {
	type Resource,
	type ResourceKind,
	useAuthorById,
	useCaseStudyById,
	useKeywordById,
	usePassageById,
	usePlaceById,
	useTextById,
} from "@/api";
import { createResourceKey } from "@/lib/search/resource-key";
import type { Item } from "@/lib/search/search.types";

const props = defineProps<{
	id: Resource["id"];
	kind: ResourceKind;
}>();

const emit = defineEmits<{
	(event: "load-item", item: Item): void;
}>();

const loadingMessage = "Loading...";

const params = computed(() => {
	return { id: props.id };
});

if (props.kind === "autor") {
	const authorByIdQuery = useAuthorById(params);

	watch(
		authorByIdQuery.data,
		(author) => {
			if (author == null) return;

			const id = author.id;
			const kind = "autor";
			const key = createResourceKey({ kind, id });
			/** @see https://github.com/acdh-oeaw/mmp/blob/master/archiv/models.py#L401 */
			const label = author.name_en;

			emit("load-item", { key, id, kind, label });
		},
		{ immediate: true },
	);
}

if (props.kind === "keyword") {
	const keywordByIdQuery = useKeywordById(params);

	watch(
		keywordByIdQuery.data,
		(keyword) => {
			if (keyword == null) return;

			const id = keyword.id;
			const kind = "keyword";
			const type = keyword.art;
			const key = createResourceKey({ kind, id });
			/** @see https://github.com/acdh-oeaw/mmp/blob/master/archiv/models.py#L609 */
			const label = `${keyword.stichwort}, [wurzel: ${keyword.wurzel}]`;

			emit("load-item", { key, id, kind, type, label });
		},
		{ immediate: true },
	);
}

if (props.kind === "stelle") {
	const passageByIdQuery = usePassageById(params);

	watch(
		passageByIdQuery.data,
		(passage) => {
			if (passage == null) return;

			const id = passage.id;
			const kind = "stelle";
			const key = createResourceKey({ kind, id });
			/** @see https://github.com/acdh-oeaw/mmp/blob/master/archiv/models.py#L1110-L1113 */
			const label =
				passage.display_label != null
					? `${passage.display_label} [${passage.id}]`
					: String(passage.id);

			emit("load-item", { key, id, kind, label });
		},
		{ immediate: true },
	);
}

if (props.kind === "text") {
	const textByIdQuery = useTextById(params);

	watch(
		textByIdQuery.data,
		(text) => {
			if (text == null) return;

			const id = text.id;
			const kind = "text";
			const key = createResourceKey({ kind, id });
			/** @see https://github.com/acdh-oeaw/mmp/blob/master/archiv/models.py#L1352 */
			const label = `${text.title} (${text.not_before} - ${text.not_after})`;

			emit("load-item", { key, id, kind, label });
		},
		{ immediate: true },
	);
}

if (props.kind === "ort") {
	const placeByIdQuery = usePlaceById(params);

	watch(
		placeByIdQuery.data,
		(place) => {
			if (place == null) return;

			const id = place.id;
			const kind = "ort";
			const key = createResourceKey({ kind, id });
			/** @see https://github.com/acdh-oeaw/mmp/blob/master/archiv/models.py#L843 */
			const label = place.name;

			emit("load-item", { key, id, kind, label });
		},
		{ immediate: true },
	);
}

if (props.kind === "usecase") {
	const caseStudyByIdQuery = useCaseStudyById(params);

	watch(
		caseStudyByIdQuery.data,
		(caseStudy) => {
			if (caseStudy == null) return;

			const id = caseStudy.id;
			const kind = "usecase";
			const key = createResourceKey({ kind, id });
			/** @see https://github.com/acdh-oeaw/mmp/blob/master/archiv/models.py#L114 */
			const label = caseStudy.title;

			emit("load-item", { key, id, kind, label });
		},
		{ immediate: true },
	);
}
</script>

<template>
	<span>
		{{ loadingMessage }}
	</span>
</template>
