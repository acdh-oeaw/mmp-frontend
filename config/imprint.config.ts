import { createUrl, createUrlSearchParams } from "@acdh-oeaw/lib";

import { metadata } from "@/config/metadata.config";
import { useRuntimeConfig } from "#imports";

const locale = metadata.locale;

export function createImprintUrl(): URL {
	const env = useRuntimeConfig();
	const redmineId = env.public.NUXT_PUBLIC_REDMINE_ID;

	return createUrl({
		baseUrl: "https://imprint.acdh.oeaw.ac.at",
		pathname: `/${redmineId}`,
		searchParams: createUrlSearchParams({ locale }),
	});
}
