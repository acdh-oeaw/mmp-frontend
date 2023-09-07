import { request } from "@acdh-oeaw/lib";
import { useQuery } from "@tanstack/vue-query";

import { url } from "~/config/imprint.config";

function getImprint(): Promise<string> {
	return request(url, { responseType: "text" }) as any;
}

export function useImprint() {
	return useQuery({
		queryKey: ["imprint"],
		queryFn: getImprint,
	});
}
