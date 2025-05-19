// src/components/site-header.tsx
'use client';

import { Button } from '@/components/ui/button';
import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export function SiteHeader() {
  const { isSignedIn } = useAuth();

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto flex h-16 items-center justify-between'>
        <div className='flex items-center'>
          <Image
            src={'/deluge-icon.png'}
            alt={'Deluge Icon'}
            width={16}
            height={16}
            // 2 space padding at the right
            className={'mr-4'}
          />
          <Link href='/' className='text-2xl font-black'>
            Deluge Next
          </Link>
        </div>
        <div className='flex items-center space-x-2'>
          {!isSignedIn ? (
            <>
              <SignInButton mode='modal'>
                <Button variant='outline'>Sign in</Button>
              </SignInButton>
              <SignUpButton mode='modal'>
                <Button>Sign up</Button>
              </SignUpButton>
            </>
          ) : (
            <UserButton afterSignOutUrl='/' />
          )}
        </div>
      </div>
    </header>
  );
}
