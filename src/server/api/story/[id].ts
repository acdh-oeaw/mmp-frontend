import { assert, keyByToMap } from "@acdh-oeaw/lib";
import { compile } from "@mdx-js/mdx";
import { HttpError } from "@stefanprobst/request";
import { valueToEstree } from "estree-util-value-to-estree";
import { defineEventHandler, H3Error } from "h3";
import type * as Hast from "hast";
import type * as _Mdxast from "remark-mdx";
import { type Transformer } from "unified";
import { SKIP, visit } from "unist-util-visit";
import { z } from "zod";

import { getCaseStudyById } from "@/api";
import { isNonEmptyString } from "@/lib/is-nonempty-string";

function getIds(values: Array<string>) {
	return values
		.map((param) => {
			return param.split("+");
		})
		.map(Number);
}

function getVisualisationParams(url: URL) {
	const segments = url.pathname.split("/").filter(Boolean);

	if (segments.includes("detail")) {
		const type = "detail";
		return {
			type,
			params: {
				passage: segments.at(-1)?.split("+").map(Number),
			},
		};
	} else {
		return {
			type: segments.at(1),
			params: {
				author: getIds(url.searchParams.getAll("Author")),
				"case-study": url.pathname.startsWith("/studies")
					? Number(url.pathname.split("/").at(1))
					: getIds(url.searchParams.getAll("Use Case")),
				keyword: getIds(url.searchParams.getAll("Keyword")),
				passage: getIds(url.searchParams.getAll("Passage")),
				place: getIds(url.searchParams.getAll("Place")),
			},
		};
	}
}

function withReplacedIframes(): Transformer<Hast.Root> {
	return function transformer(tree) {
		visit(tree, function onElement(element, index, parent) {
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

			const visualisation = getVisualisationParams(url);
			console.dir({ visualisation, url: url.href }, { depth: null });

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
		visit(tree, function onElement(element) {
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
		/** @see https://github.com/mdx-js/mdx/discussions/2260 */
		const html = story.story_map?.replace(/&nbsp;/g, "");

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
