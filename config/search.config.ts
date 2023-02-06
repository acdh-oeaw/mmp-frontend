import type { Item } from '@/lib/search/search.types';

export const recommendedSearchFilters: Record<Item['key'], Item> = {
	autor__8: {
		id: 8,
		label: 'Baudonivia von Poitiers',
		kind: 'autor',
		key: 'autor__8',
	},
	keyword__33: {
		id: 33,
		label: 'barbari',
		kind: 'keyword',
		type: 'Ethnonym',
		key: 'keyword__33',
	},
	usecase__3: {
		id: 3,
		label: 'Steppe Peoples 1: "Schwarzes Meer"',
		kind: 'usecase',
		key: 'usecase__3',
	},
};
