import 'server-only';

import DelugePage from '@/app/list/components/deluge-page';
import { prisma } from '@/lib/db';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get('deluge-next-session')?.value;

  if (!token) {
    redirect('/login');
  }

  const session = await decrypt(token);

  const sessionExists = await prisma.session.findUnique({
    where: { id: session?.sessionId },
  });

  if (!sessionExists) {
    redirect('/login');
  }

  const delugeNextBaseUrl = process.env.DELUGE_NEXT_BASE_URL;

  if (delugeNextBaseUrl === undefined) {
    throw new Error('DELUGE_NEXT_BASE_URL is not defined');
  }

  return <DelugePage baseUrl={delugeNextBaseUrl} />;
}
