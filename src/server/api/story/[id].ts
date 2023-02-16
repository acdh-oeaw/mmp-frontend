import { compile } from "@mdx-js/mdx";
import { assert } from "@stefanprobst/assert";
import { keyByToMap } from "@stefanprobst/key-by";
import { HttpError } from "@stefanprobst/request";
import { valueToEstree } from "estree-util-value-to-estree";
import { H3Error } from "h3";
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

			const type = url.pathname.split("/").filter(Boolean).at(-1);
			const visualisation = {
				type,
				params: {
					author: url.searchParams.getAll("Author").map(Number),
					"case-study": url.pathname.startsWith("/studies")
						? Number(url.pathname.split("/").at(1))
						: url.searchParams.getAll("Use Case").map(Number),
					keyword: url.searchParams.getAll("Keyword").map(Number),
					passage: url.searchParams.getAll("Passage").map(Number),
					place: url.searchParams.getAll("Place").map(Number),
				},
			};

			parent.children[index] = {
				type: "mdxJsxFlowElement",
				name: "StoryVisualisation",
				children: [],
				data: {
					_mdxExplicitJsx: true,
				},
				attributes: [
					{
						type: "mdxJsxAttribute",
						name: "caption",
						value: iframeAttributes.get("name")?.value ?? "",
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
							value: JSON.stringify(visualisation.params),
							data: {
								estree: {
									type: "Program",
									sourceType: "module",
									comments: [],
									body: [
										{
											type: "ExpressionStatement",
											expression: valueToEstree(visualisation.params),
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

function withNoStyleAttributes(): Transformer<Hast.Root> {
	return function transformer(tree) {
		visit(tree, function onIframe(element) {
			if (element.type !== "mdxJsxFlowElement" && element.type !== "mdxJsxTextElement") return;

			const index = element.attributes.findIndex((attribute) => {
				assert(attribute.type === "mdxJsxAttribute");
				return attribute.name === "style";
			});

			if (index !== -1) {
				element.attributes.splice(index, 1);
			}
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

		if (!isNonEmptyString(html)) {
			throw createError({ statusCode: 404 });
		}

		/**
		 * We assume that the html returned by the backend can be parsed as mdx.
		 */
		const code = String(
			await compile(html, {
				development: false,
				outputFormat: "function-body",
				rehypePlugins: [withReplacedIframes, withNoStyleAttributes],
			}),
		);

		return { code };
	} catch (error) {
		const statusCode =
			error instanceof HttpError
				? error.response.status
				: error instanceof H3Error
				? error.statusCode
				: 500;

		throw createError({ statusCode });
	}
});
