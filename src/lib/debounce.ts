type Fn<TParams extends Array<unknown>, TResult> = (...params: TParams) => TResult;

type Timer = ReturnType<typeof setTimeout>;

export interface Options {
	/** @default 250 */
	delay?: number;
	/** @default 'trailing' */
	edge?: "leading" | "trailing";
}

function trailing<TParams extends Array<unknown>, T>(
	callback: Fn<TParams, void>,
	delay: number,
): Fn<TParams, void> {
	let timer: Timer | null = null;

	return function (this: T, ...args) {
		if (timer != null) {
			clearTimeout(timer);
		}

		timer = setTimeout(() => {
			callback.apply(this, args);
		}, delay);
	};
}

function leading<TParams extends Array<unknown>, T>(
	callback: Fn<TParams, void>,
	delay: number,
): Fn<TParams, void> {
	let timer: Timer | null = null;

	return function (this: T, ...args) {
		if (timer == null) {
			callback.apply(this, args);
		} else {
			clearTimeout(timer);
		}

		timer = setTimeout(() => {
			timer = null;
		}, delay);
	};
}

export function debounce<TParams extends Array<unknown>>(
	callback: Fn<TParams, void>,
	options: Options = {},
): Fn<TParams, void> {
	const { delay = 250, edge } = options;

	if (edge === "leading") {
		return leading(callback, delay);
	}

	return trailing(callback, delay);
}
