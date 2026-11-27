import { expect, test } from "@playwright/test";

test("keeps Tailwind utility spacing above the global reset", async ({ page }) => {
	await page.goto("/");
	const hero = page.getByRole("heading", { name: "Mapping Medieval Peoples" }).locator("..");
	await expect(hero).toHaveCSS("display", "grid");
	await expect(hero).toHaveCSS("row-gap", "16px");
	await expect(page.getByRole("banner")).toBeVisible();
	const search = page.getByRole("main").getByRole("link", { name: "Search the data" });
	await expect(search).toHaveCSS("padding-top", "16px");
});
