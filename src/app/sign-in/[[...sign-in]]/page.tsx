import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className='flex h-screen w-full items-center justify-center bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50'>
      <div className='rounded-xl backdrop-blur-md bg-white/40 border border-white/30 shadow-lg p-8 max-w-md w-full'>
        <SignIn />
      </div>
    </div>
  );
}
