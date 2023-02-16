import { compile } from "@mdx-js/mdx";
import { assert } from "@stefanprobst/assert";
import { keyByToMap } from "@stefanprobst/key-by";
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

			const iframeAttributes = keyByToMap(element.attributes, (attribute) => {
				assert(attribute.type === "mdxJsxAttribute");
				return attribute.name;
			});

			const src = iframeAttributes.get("src")?.value;
			assert(typeof src === "string");
			/** The GitHub pages deployment, which is referenced in iframes, uses hash router. */
			const hash = new URL(src).hash.slice(1);
			const url = new URL(hash, "https://n");
			const visualisation = {
				type: url.pathname.split("/").filter(Boolean).at(-1),
				params: {
					author: url.searchParams.getAll("Author"),
					"case-study": url.searchParams.getAll("Use Case"),
					keyword: url.searchParams.getAll("Keyword"),
					passage: url.searchParams.getAll("Passage"),
					place: url.searchParams.getAll("Place"),
				},
			};

			parent.children[index] = {
				type: "mdxJsxFlowElement",
				name: "StoryVisualisation",
				children: [],
				attributes: [
					{
						type: "mdxJsxAttribute",
						name: "caption",
						value: iframeAttributes.get("name")?.value,
					},
					{
						type: "mdxJsxAttribute",
						name: "type",
						value: visualisation.type,
					},
					{
						type: "mdxJsxAttribute",
						name: "filters",
						value: {
							type: "mdxJsxAttributeValueExpression",
							data: {
								estree: {
									type: "Program",
									sourceType: "module",
									comments: [],
									body: [
										{
											type: "ExpressionStatement",
											/* @ts-expect-error TODO: type */
											expression: visualisation.params,
										},
									],
								},
							},
						},
					},
				],
			};

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
