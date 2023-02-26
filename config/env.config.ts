import { assert } from "@stefanprobst/assert";

interface Env {
	VITE_APP_API_BASE_URL: string;
	VITE_APP_BASE_URL: string;
	VITE_APP_MATOMO_BASE_URL?: string;
	VITE_APP_MATOMO_ID?: string;
	VITE_APP_REDMINE_ID: string;
}

assert(import.meta.env.VITE_APP_API_BASE_URL);
assert(import.meta.env.VITE_APP_BASE_URL);
assert(import.meta.env.VITE_APP_REDMINE_ID);

export const env: Env = {
	VITE_APP_API_BASE_URL: import.meta.env.VITE_APP_API_BASE_URL,
	VITE_APP_BASE_URL: import.meta.env.VITE_APP_BASE_URL,
	VITE_APP_MATOMO_BASE_URL: import.meta.env.VITE_APP_MATOMO_BASE_URL,
	VITE_APP_MATOMO_ID: import.meta.env.VITE_APP_MATOMO_ID,
	VITE_APP_REDMINE_ID: import.meta.env.VITE_APP_REDMINE_ID,
};
