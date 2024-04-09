const formatter = new Intl.ListFormat("en");

export function createList(list: Array<string>): string {
	return formatter.format(list);
}
