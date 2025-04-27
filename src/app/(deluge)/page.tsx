// app/(deluge)/page.tsx
'use client';

import { columns } from '@/app/(deluge)/columns';
import { DataTable } from '@/app/(deluge)/data-table';
import { AllClientData, NormalizedTorrent } from '@ctrl/shared-torrent';
import { useQuery } from '@tanstack/react-query';

async function fetchAllData() {
  const origin = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${origin}/api/deluge`);
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || 'Failed to load torrents');
  }
  return json.data as AllClientData;
}

export default function DelugePage() {
  const {
    data: allData,
    isLoading,
    isError,
    error,
  } = useQuery({ queryKey: ['torrents'], queryFn: fetchAllData });

  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-2xl font-bold mb-4'>Deluge Torrents</h1>
      {isLoading && <p>Loading...</p>}
      {isError && (
        <p className='text-red-500'>
          Error: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      )}
      {allData && (
        <DataTable<NormalizedTorrent>
          columns={columns}
          data={allData.torrents}
        />
      )}
    </div>
  );
}
