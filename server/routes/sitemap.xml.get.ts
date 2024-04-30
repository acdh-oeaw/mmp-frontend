import { join } from "node:path";

import { defaultContentType, defineEventHandler } from "#imports";
import { getCaseStudies } from "@/api";
import { createUrl, isNonEmptyString } from "@acdh-oeaw/lib";
import fg from "fast-glob";
import { z } from "zod";

const baseUrl = z.string().url().parse(process.env.NUXT_PUBLIC_APP_BASE_URL);

async function createSitemap() {
	// eslint-disable-next-line import/no-named-as-default-member
	const paths = fg.globSync("./**/*.vue", { cwd: join(process.cwd(), "pages") });

	const routes: Array<string> = [];

	paths.forEach((path) => {
		const _route = path.slice(0, -".vue".length).replace(/(\/)?index$/, "");
		const route = _route.length === 0 ? _route : "/" + _route;

		const segments = [];

		for (const segment of route.split("/")) {
			/** Dynamic routes. */
			if (segment.startsWith("[") && segment.endsWith("]")) return;

			segments.push(segment);
		}

		routes.push(segments.join("/"));
	});

	const entries: Array<{ url: string; lastModified?: Date }> = routes.map((pathname) => {
		console.log(baseUrl);
		return {
			url: String(createUrl({ baseUrl, pathname })),
			// lastModified: new Date(),
		};
	});

	const caseStudies = await getCaseStudies({ limit: 1000 });
	for (const caseStudy of caseStudies.results) {
		const url = createUrl({ baseUrl, pathname: `/case-studies/${caseStudy.id}/` });

		const segments = [
			"timeline",
			"network-graph-visualisation",
			"geo-map-visualisation",
			"word-cloud-visualisation",
			"texts-by-authors",
		];

		if (isNonEmptyString(caseStudy.story_map)) {
			segments.push("story");
		}

		segments.forEach((pathname) => {
			entries.push({ url: String(createUrl({ baseUrl: url, pathname })) });
		});
	}

	const sitemap = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...entries.flatMap((entry) => {
			const elements = ["<url>", `<loc>${entry.url}</loc>`];
			if (entry.lastModified != null) {
				elements.push(`<lastmod>${entry.lastModified.toISOString()}</lastmod>`);
			}
			elements.push("</url>");
			return elements;
		}),
		"</urlset>",
	].join("\n");

	return sitemap;
}

export default defineEventHandler(async (event) => {
	const sitemap = await createSitemap();
	defaultContentType(event, "application/xml");
	return sitemap;
});
