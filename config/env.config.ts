import { z } from "zod";

const schema = z.object({
	VITE_APP_API_BASE_URL: z.string(),
});

export const env = schema.parse(import.meta.env);
