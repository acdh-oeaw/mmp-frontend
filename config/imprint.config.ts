import { createUrl } from "@stefanprobst/request";

import { env } from "~/config/env.config";
import { metadata } from "~/config/metadata.config";

const baseUrl = "https://shared.acdh.oeaw.ac.at";
const pathname = "/acdh-common-assets/api/imprint.php";
const redmineId = env.VITE_APP_REDMINE_ID;
const locale = metadata.locale;

export const url = createUrl({
	baseUrl,
	pathname,
	searchParams: {
		outputLang: locale,
		serviceID: redmineId,
	},
});
