import 'server-only';

import { validateSession } from '@/app/actions/auth';
import DelugePage from '@/app/list/components/deluge-page';
import { redirect } from 'next/navigation';

export default async function Page() {
  const { authenticated } = await validateSession();

  if (!authenticated) {
    redirect('/login');
  }

  const delugeNextBaseUrl = process.env.DELUGE_NEXT_BASE_URL;

  if (delugeNextBaseUrl === undefined) {
    throw new Error('DELUGE_NEXT_BASE_URL is not defined');
  }

  return <DelugePage baseUrl={delugeNextBaseUrl} />;
}
