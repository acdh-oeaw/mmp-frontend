import { request } from "@acdh-oeaw/lib";
import { useQuery } from "@tanstack/vue-query";

import { createImprintUrl } from "@/config/imprint.config";

function getImprint(): Promise<string> {
	const url = createImprintUrl();

	return request(url, { responseType: "text" }) as Promise<string>;
}

export function useImprint() {
	return useQuery({
		queryKey: ["imprint"],
		queryFn: getImprint,
	});
}
