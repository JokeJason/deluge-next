import 'server-only';

import DelugePage from '@/app/list/components/deluge-page';
import { getDelugeClient } from '@/lib/deluge-client';
import { auth } from '@clerk/nextjs/server';

export default async function Page() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();

  const deluge = await getDelugeClient();
  if (!deluge) {
    return <div>Deluge client not available</div>;
  }
  if (!(await deluge.checkSession())) {
    // TODO: handle deluge client session properly using error boundary
    return <div>Check session failed</div>;
  }

  return <DelugePage />;
}
