import { SkeletonGrid } from '@/components/ui/Skeleton';
import { Navbar, Footer } from '@/components/layout';

export default function Loading() {
  return (
    <>
      <Navbar categories={[]} />
      <div className="bg-accent-50 border-y border-accent-200 py-3 animate-pulse">
        <div className="container-main">
          <div className="flex items-center gap-4">
            <div className="h-5 w-24 bg-accent-200 rounded" />
            <div className="h-5 w-32 bg-accent-200 rounded" />
            <div className="h-5 w-20 bg-accent-200 rounded" />
            <div className="h-5 w-16 bg-accent-200 rounded" />
          </div>
        </div>
      </div>
      <main className="flex-1 animate-pulse">
        <div className="container-main py-12 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="flex-1 space-y-4 max-w-2xl">
              <div className="h-4 w-32 bg-neutral-200 rounded" />
              <div className="h-10 w-full bg-neutral-200 rounded" />
              <div className="h-10 w-3/4 bg-neutral-200 rounded" />
              <div className="h-6 w-3/4 bg-neutral-200 rounded" />
              <div className="h-6 w-1/2 bg-neutral-200 rounded" />
              <div className="flex gap-3 mt-4">
                <div className="h-12 w-48 bg-neutral-200 rounded-lg flex-1" />
                <div className="h-12 w-48 bg-neutral-200 rounded-lg flex-1" />
              </div>
            </div>
            <div className="flex-1 flex justify-center hidden lg:block">
              <div className="aspect-[4/3] w-full max-w-md bg-neutral-200 rounded-2xl" />
            </div>
          </div>
        </div>
        
        <section className="py-8 bg-white">
          <div className="container-main">
            <div className="mb-6">
              <div className="h-7 w-48 bg-neutral-200 rounded" />
              <div className="h-5 w-64 bg-neutral-200 rounded mt-2" />
            </div>
            <SkeletonGrid columns={4} rows={2} />
          </div>
        </section>
        
        <section className="py-8 bg-neutral-50">
          <div className="container-main">
            <div className="mb-6">
              <div className="h-7 w-48 bg-neutral-200 rounded" />
              <div className="h-5 w-64 bg-neutral-200 rounded mt-2" />
            </div>
            <SkeletonGrid columns={4} rows={2} />
          </div>
        </section>
        
        <section className="py-8 bg-white">
          <div className="container-main">
            <div className="mb-6">
              <div className="h-7 w-40 bg-neutral-200 rounded" />
              <div className="h-5 w-48 bg-neutral-200 rounded mt-2" />
            </div>
            <SkeletonGrid columns={4} rows={3} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}