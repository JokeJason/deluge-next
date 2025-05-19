import 'server-only';

import React from 'react';

interface ListLayoutProps {
  children: React.ReactNode;
}

export default function ListLayout({ children }: ListLayoutProps) {
  return (
    <div className='border-grid flex flex-1 flex-col'>
      <main className='flex flex-1 flex-col'>{children}</main>
    </div>
  );
}
