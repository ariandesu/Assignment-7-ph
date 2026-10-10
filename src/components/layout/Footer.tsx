import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300" role="contentinfo">
      <div className="container-main py-10 lg:py-14">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          {/* Left side */}
          <div className="text-center md:text-left">
            <Link href="/" className="flex items-center gap-3 mb-4" aria-label="বাজার দর - হোম">
              <span className="text-3xl" aria-hidden="true">🛒</span>
              <span className="text-heading-lg font-bold text-white">বাজার দর</span>
            </Link>
            <p className="text-body-md max-w-xs mx-auto md:mx-0">
              প্রয়োজনীয় পণ্যের দাম এক নজরে।
            </p>
          </div>

          {/* Right side */}
          <div className="text-center md:text-right">
            <p className="text-body-sm text-neutral-400 max-w-md mx-auto md:mx-0">
              “সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।”
            </p>
            <p className="mt-3 text-caption text-neutral-500">
              © {new Date().getFullYear()} বাজার দর। সকল অধিকার সংরক্ষিত।
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}