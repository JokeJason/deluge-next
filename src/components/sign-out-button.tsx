'use client';

import { signout } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import 'client-only';

export default function SignOutButton() {
  const handleSignOut = async () => {
    await signout();
  };

  return (
    <Button className={'hover:scale-110'} onClick={handleSignOut}>
      Sign out
    </Button>
  );
}
