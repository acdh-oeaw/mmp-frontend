import { assert } from '@stefanprobst/assert';
import { createUrl } from '@stefanprobst/request';

import { metadata } from '~/config/metadata.config';

const baseUrl = 'https://shared.acdh.oeaw.ac.at';
const pathname = '/acdh-common-assets/api/imprint.php';
const redmineId = import.meta.env['VITE_APP_REDMINE_ID'];
const locale = metadata.locale;

assert(
  redmineId != null,
  'Please set the REDMINE_ID environment variable to the redmine service issue id.'
);

export const url = createUrl({
  baseUrl,
  pathname,
  searchParams: { serviceID: redmineId, outputLang: locale },
});
