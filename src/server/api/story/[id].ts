import { HttpError } from "@stefanprobst/request";
import { z } from "zod";

import { getCaseStudyById } from "@/api";

const schema = z.object({ id: z.coerce.number().int() });

export default defineEventHandler(async (event) => {
	const params = schema.safeParse(event.context.params);

	if (!params.success) {
		throw createError({ statusCode: 400 });
	}

	try {
		const story = await getCaseStudyById({ id: params.data.id });

		return { story };
	} catch (error) {
		const statusCode = error instanceof HttpError ? error.response.status : 500;
		throw createError({ statusCode });
	}
});
