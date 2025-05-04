import 'server-only';

import { AnimatedBackground } from '@/app/login/components/animated-background';
import { LoginForm } from '@/app/login/components/login-form';
import { prisma } from '@/lib/db';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('deluge-next-session')?.value;

  const session = await decrypt(token);

  const sessionExists = await prisma.session.findUnique({
    where: { id: session?.sessionId },
  });

  if (sessionExists) {
    redirect('/list');
  }

  return (
    <div className='flex h-screen w-full'>
      {/* Left panel with vibrant animation */}
      <div className='hidden w-1/2 lg:block'>
        <AnimatedBackground />
      </div>

      {/* Right panel with login form */}
      <div className='flex w-full items-center justify-center lg:w-1/2'>
        <div className='mx-auto w-full max-w-md space-y-6 p-8'>
          <div className='space-y-2 text-center'>
            <h1 className='text-3xl font-bold'>Deluge Next</h1>
            <p className='text-muted-foreground'>
              Enter your password to access your downloads
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
