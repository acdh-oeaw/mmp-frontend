/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_APP_API_BASE_URL: string | undefined;
	readonly VITE_APP_BASE_URL: string | undefined;
	readonly VITE_APP_MATOMO_BASE_URL: string | undefined;
	readonly VITE_APP_MATOMO_ID: string | undefined;
	readonly VITE_APP_REDMINE_ID: string | undefined;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
