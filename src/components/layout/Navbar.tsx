'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { Category } from '@/types';

interface NavbarProps {
  categories: Category[];
  user?: { name: string; email: string; image?: string } | null;
}

export function Navbar({ categories, user }: NavbarProps) {
  const pathname = usePathname();
  const banglaDate = getBanglaDate();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
      {/* Top Row: Logo + Bangla Date */}
      <div className="container-main py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="বাজার দর - হোম">
            <span className="text-3xl" aria-hidden="true">🛒</span>
            <div>
              <span className="text-heading-lg font-bold text-neutral-900">বাজার দর</span>
              <p className="text-caption text-neutral-500 whitespace-nowrap">{banglaDate}</p>
            </div>
          </Link>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link href="/profile">
                  <Button variant="ghost" size="sm">
                    <span className="flex items-center gap-1.5">
                      {user.image ? (
                        <img src={user.image} alt="" className="h-6 w-6 rounded-full" />
                      ) : (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-body-sm font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                      <span className="hidden sm:inline">{user.name}</span>
                    </span>
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  সাইন আউট
                </Button>
              </>
            ) : (
              <>
                <Link href="/signin">
                  <Button variant="ghost" size="sm">
                    সাইন ইন
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm">
                    সাইন আপ
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Category Navigation Row */}
      <nav className="bg-neutral-50 border-b border-neutral-200" aria-label="ক্যাটাগরি নেভিগেশন">
        <div className="container-main">
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto py-3 scrollbar-hide" role="navigation">
            {categories.map((category) => {
              const isActive = pathname === `/category/${category.slug}`;
              return (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className={cn(
                    'flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-body-sm font-medium transition-colors duration-200',
                    isActive
                      ? 'bg-primary-50 text-primary-700 shadow-sm'
                      : 'text-neutral-600 hover:bg-white hover:text-neutral-900'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span aria-hidden="true">{category.emoji}</span>
                  <span>{category.nameBn || category.name}</span>
                  {category.productCount !== undefined && (
                    <Badge variant="neutral" size="sm">
                      {category.productCount}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}

function getBanglaDate(): string {
  const now = new Date();
  const banglaMonths = [
    'বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন',
    'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'
  ];
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  
  const month = now.getMonth();
  const day = now.getDate();
  const year = now.getFullYear() - 593;
  
  const toBengali = (num: number) => String(num).replace(/\d/g, (d) => banglaDigits[parseInt(d, 10)]);
  
  return `${banglaMonths[month]} ${toBengali(day)}, ${toBengali(year)}`;
}

async function signOut() {
  try {
    await fetch('/api/auth/signout', { method: 'POST' });
    window.location.href = '/';
  } catch {
    window.location.href = '/';
  }
}