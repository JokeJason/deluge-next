'use client';

import { signout } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import 'client-only';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function SignOutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);

    await signout();
  };

  return isSigningOut ? (
    <Button disabled>
      <Loader2 className={'animate-spin'} />
      Signing out...
    </Button>
  ) : (
    <Button className={'hover:scale-110'} onClick={handleSignOut}>
      Sign out
    </Button>
  );
}
