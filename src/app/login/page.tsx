import { AnimatedBackground } from '@/app/login/components/animated-background';
import { LoginForm } from '@/app/login/components/login-form';

export default function LoginPage() {
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
