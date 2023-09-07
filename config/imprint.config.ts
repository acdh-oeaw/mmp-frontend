import { createUrl, createUrlSearchParams } from "@acdh-oeaw/lib";

import { env } from "~/config/env.config";
import { metadata } from "~/config/metadata.config";

const redmineId = env.VITE_APP_REDMINE_ID;
const locale = metadata.locale;

export const url = createUrl({
	baseUrl: "https://imprint.acdh.oeaw.ac.at",
	pathname: `/${redmineId}`,
	searchParams: createUrlSearchParams({ locale }),
});
