import { assert } from "@stefanprobst/assert";
import { HttpError } from "@stefanprobst/request";
import fromHtml from "rehype-parse";
import { unified } from "unified";
import { z } from "zod";

import { getCaseStudyById } from "@/api";

const schema = z.object({ id: z.coerce.number().int() });

const processor = unified().use(fromHtml);

export default defineEventHandler(async (event) => {
	const params = schema.safeParse(event.context.params);

	if (!params.success) {
		throw createError({ statusCode: 400 });
	}

	try {
		const story = await getCaseStudyById({ id: params.data.id });
		const html = story.story_map;
		assert(html != null);

		const tree = processor.parse(html);

		return { tree };
	} catch (error) {
		const statusCode = error instanceof HttpError ? error.response.status : 500;
		throw createError({ statusCode });
	}
});
