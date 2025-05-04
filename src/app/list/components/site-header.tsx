import { Button } from '@/components/ui/button';

export async function SiteHeader() {
  return (
    <header className='border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto flex h-16 items-center justify-between px-1'>
        <h1 className='text-2xl font-black'>Deluge Next - Torrents</h1>
        <Button className={'hover:scale-110'}>Sign out</Button>
      </div>
    </header>
  );
}
