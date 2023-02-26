import { request } from "@stefanprobst/request";
import { useQuery } from "@tanstack/vue-query";

import { url } from "~/config/imprint.config";

function getImprint(): Promise<string> {
	return request(url, { responseType: "text" });
}

export function useImprint() {
	return useQuery({
		queryKey: ["imprint"],
		queryFn: getImprint,
	});
}
