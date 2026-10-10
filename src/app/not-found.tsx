import { Navbar, Footer } from '@/components/layout';
import { EmptyState } from '@/components/home';

export default function NotFound() {
  return (
    <>
      <Navbar categories={[]} />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md text-center">
          <EmptyState
            message="পৃষ্ঠা পাওয়া যায়নি"
            description="আপনি যে পৃষ্ঠাটি খুঁজছেন তা বিদ্যমান নেই বা সরানো হয়েছে।"
            actionHref="/"
            actionText="হোম পেজে ফিরে যান"
          />
        </div>
      </main>
      <Footer />
    </>
  );
}