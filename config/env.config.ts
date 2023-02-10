import { z } from "zod";

const schema = z.object({
	VITE_APP_API_BASE_URL: z.string(),
	VITE_APP_BASE_URL: z.string(),
	VITE_APP_MATOMO_BASE_URL: z.string().optional(),
	VITE_APP_MATOMO_ID: z.string().optional(),
	VITE_APP_REDMINE_ID: z.string(),
});

export const env = schema.parse(import.meta.env);
