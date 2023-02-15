import { compile } from "@mdx-js/mdx";
import { assert } from "@stefanprobst/assert";
import { keyBy } from "@stefanprobst/key-by";
import { HttpError } from "@stefanprobst/request";
import type * as Hast from "hast";
import type * as _Mdxast from "remark-mdx";
import { type Transformer } from "unified";
import { SKIP, visit } from "unist-util-visit";
import { z } from "zod";

import { getCaseStudyById } from "@/api";
import { isNonEmptyString } from "@/lib/is-nonempty-string";

function withReplacedIframes(): Transformer<Hast.Root> {
	return function transformer(tree) {
		visit(tree, function onIframe(element, index, parent) {
			if (element.type !== "mdxJsxFlowElement" || element.name !== "iframe") return;
			if (index == null || parent == null) return;

			const attributes = keyBy(element.attributes, (attribute) => {
				assert(attribute.type === "mdxJsxAttribute");
				return attribute.name;
			});

			console.log(attributes["name"]);
			console.log(attributes["src"]);

			parent.children[index] = { type: "text", value: "TEST" };

			return SKIP;
		});
	};
}

const schema = z.object({ id: z.coerce.number().int() });

export default defineEventHandler(async (event) => {
	const params = schema.safeParse(event.context.params);

	if (!params.success) {
		throw createError({ statusCode: 400 });
	}

	try {
		const story = await getCaseStudyById({ id: params.data.id });
		const html = story.story_map;
		assert(isNonEmptyString(html));

		/**
		 * We assume that the html returned by the backend can be parsed as mdx.
		 */
		const code = String(
			await compile(html, {
				development: false,
				outputFormat: "function-body",
				rehypePlugins: [withReplacedIframes],
			}),
		);

		return { code };
	} catch (error) {
		const statusCode = error instanceof HttpError ? error.response.status : 500;
		throw createError({ statusCode });
	}
});
