import { assert } from "@acdh-oeaw/lib";
import { computed, type ComputedRef } from "vue";

import { type Author, type GetPassages, type Text, usePassages } from "@/api";
import { usePassagesSearchParams } from "@/lib/search/use-passages-search-params";
import { type SearchFilters } from "@/lib/search/use-search-filters";

type Passage = GetPassages.Response["results"][number];

export function useTextsByAuthors(searchFilters: ComputedRef<SearchFilters>) {
	const _searchFilters = computed(() => {
		/** @see https://github.com/acdh-oeaw/mmp/issues/201 */
		const _searchFilters = { ...searchFilters.value, offset: 0, limit: 1000 };
		return _searchFilters;
	});
	const searchParams = usePassagesSearchParams(_searchFilters);
	const passagesQuery = usePassages(searchParams);
	const isLoading = passagesQuery.isInitialLoading;
	const isError = passagesQuery.isError;
	const isFetching = passagesQuery.isFetching;
	const data = computed(() => {
		const passages = passagesQuery.data.value?.results ?? [];

		const passagesById = new Map<Passage["id"], Passage>();
		const textsById = new Map<Text["id"], Text>();
		const authorsById = new Map<Author["id"], Author>();
		const passageIdsByTextTd = new Map<Text["id"], Set<Passage["id"]>>();
		const passageIdsByAuthorId = new Map<Author["id"], Set<Passage["id"]>>();
		const textIdsByAuthorId = new Map<Author["id"], Set<Text["id"]>>();

		passages.forEach((passage) => {
			passagesById.set(passage.id, passage);

			const text = passage.text;
			/** @see https://github.com/acdh-oeaw/mmp/issues/170 */
			assert(text);
			textsById.set(text.id, text);

			if (!passageIdsByTextTd.has(text.id)) {
				passageIdsByTextTd.set(text.id, new Set([passage.id]));
			} else {
				passageIdsByTextTd.get(text.id)?.add(passage.id);
			}

			const authors = text.autor;
			authors.forEach((author) => {
				authorsById.set(author.id, author);

				if (!passageIdsByAuthorId.has(author.id)) {
					passageIdsByAuthorId.set(author.id, new Set([passage.id]));
				} else {
					passageIdsByAuthorId.get(author.id)?.add(passage.id);
				}

				if (!textIdsByAuthorId.has(author.id)) {
					textIdsByAuthorId.set(author.id, new Set([text.id]));
				} else {
					textIdsByAuthorId.get(author.id)?.add(text.id);
				}
			});
		});

		return {
			passagesById,
			textsById,
			authorsById,
			passageIdsByTextTd,
			passageIdsByAuthorId,
			textIdsByAuthorId,
		};
	});
	const isEmpty = computed(() => {
		return data.value.passagesById.size === 0;
	});

	return {
		passagesQuery,
		data,
		isEmpty,
		isError,
		isFetching,
		isLoading,
	};
}
