import 'server-only';

import DelugePage from '@/app/(deluge)/components/deluge-page';

export default async function Page() {
  const delugeNextBaseUrl = process.env.DELUGE_NEXT_BASE_URL || '';

  if (delugeNextBaseUrl !== '') {
    throw new Error('DELUGE_NEXT_BASE_URL is not defined');
  }

  return <DelugePage baseUrl={delugeNextBaseUrl} />;
}
