import 'server-only';

import { SiteHeader } from '@/app/list/components/site-header';
import React from 'react';

interface ListLayoutProps {
  children: React.ReactNode;
}

export default function ListLayout({ children }: ListLayoutProps) {
  return (
    <div className='border-grid flex flex-1 flex-col'>
      <SiteHeader />
      <main className='flex flex-1 flex-col'>{children}</main>
    </div>
  );
}
