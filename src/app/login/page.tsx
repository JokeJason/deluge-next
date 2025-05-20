import 'server-only';

import { AnimatedBackground } from '@/app/login/components/animated-background';
import { PasswordForm } from '@/app/login/components/password-form';

export default async function LoginPage() {
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
            <h1 className='text-3xl font-bold'>Deluge Password</h1>
            <p className='text-muted-foreground'>
              Enter your password to access your Deluge instance.
            </p>
          </div>
          <PasswordForm />
        </div>
      </div>
    </div>
  );
}
