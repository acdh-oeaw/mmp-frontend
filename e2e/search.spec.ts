import { expect, test } from "@playwright/test";

function author(id: number, name: string) {
	return { id, name, ort: null, gnd_id: "", kommentar: "" };
}

test.beforeEach(async ({ page }) => {
	await page.route(
		(url) => url.pathname.startsWith("/api/"),
		async (route) => {
			await route.fulfill({ json: { count: 0, next: null, previous: null, results: [] } });
		},
	);
});

test("retains authors while loading the next page and reuses the detail cache", async ({
	page,
}) => {
	let releasePage!: () => void;
	const nextPageReady = new Promise<void>((resolve) => {
		releasePage = resolve;
	});
	const second = author(2, "Second fixture author");
	let detailRequests = 0;

	await page.route("**/api/autor/2/", async (route) => {
		detailRequests++;
		await route.fulfill({ json: second });
	});
	await page.route("**/api/autor/**", async (route) => {
		if (new URL(route.request().url()).pathname !== "/api/autor/") {
			await route.fallback();
			return;
		}
		const offset = Number(new URL(route.request().url()).searchParams.get("offset"));
		if (offset > 0) await nextPageReady;
		await route.fulfill({
			json: {
				count: 100,
				next: offset === 0 ? "next" : null,
				previous: offset > 0 ? "previous" : null,
				results: [offset === 0 ? author(1, "First fixture author") : second],
			},
		});
	});

	await page.goto("/browse/authors");
	const first = page.getByRole("link", { name: "First fixture author" });
	await expect(first).toBeVisible();
	try {
		const requested = page.waitForRequest((request) => {
			const url = new URL(request.url());
			return url.pathname === "/api/autor/" && Number(url.searchParams.get("offset")) > 0;
		});
		await page.getByRole("link", { name: "Next page" }).click();
		await requested;
		await expect(first).toBeVisible();
	} finally {
		releasePage();
	}
	await page.getByRole("link", { name: second.name }).click();
	await expect(page.getByRole("heading", { name: second.name })).toBeVisible();
	expect(detailRequests).toBe(0);
});

test("updates a single year with the keyboard", async ({ page }) => {
	await page.goto("/explore/search-results?date-range=500");
	const slider = page.getByRole("slider", { name: "Date range" });
	await expect(slider).toHaveAttribute("aria-valuenow", "500");
	await slider.press("ArrowRight");
	await expect(slider).toHaveAttribute("aria-valuenow", "501");
	await expect(page).toHaveURL(/date-range=501/);
});

test("keeps range thumbs apart and commits the drag on pointer release", async ({ page }) => {
	await page.goto("/explore/search-results?date-range=100&date-range=500");
	const sliders = page.getByRole("slider", { name: "Date range" });
	const lower = sliders.first();
	const upper = sliders.last();
	await expect(sliders).toHaveCount(2);
	await lower.press("End");
	await expect(lower).toHaveAttribute("aria-valuenow", "499");
	await expect(page).toHaveURL(/date-range=499&date-range=500/);

	await page.goto("/explore/search-results?date-range=100&date-range=500");
	await expect(upper).toHaveAttribute("aria-valuenow", "500");
	const thumb = await upper.boundingBox();
	if (!thumb) throw new Error("The upper slider thumb is not visible.");
	const x = thumb.x + thumb.width / 2;
	const y = thumb.y + thumb.height / 2;
	await page.mouse.move(x, y);
	await page.mouse.down();
	try {
		await page.mouse.move(x + 50, y, { steps: 5 });
		await expect
			.poll(async () => Number(await upper.getAttribute("aria-valuenow")))
			.toBeGreaterThan(500);
		await expect(page).toHaveURL(/date-range=100&date-range=500/);
	} finally {
		await page.mouse.up();
	}
	const year = await upper.getAttribute("aria-valuenow");
	await expect(page).toHaveURL(new RegExp("date-range=100&date-range=" + year));
});
