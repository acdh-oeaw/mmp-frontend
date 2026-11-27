import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:4173";

export default defineConfig({
	testDir: "./e2e",
	use: {
		...devices["Desktop Chrome"],
		baseURL,
		trace: "retain-on-failure",
	},
	webServer: {
		command: "pnpm exec nuxt dev --host 127.0.0.1 --port 4173",
		env: {
			NUXT_PUBLIC_API_BASE_URL: baseURL,
			NUXT_PUBLIC_APP_BASE_URL: baseURL,
			NUXT_TELEMETRY_DISABLED: "1",
		},
		reuseExistingServer: false,
		url: baseURL,
	},
});
