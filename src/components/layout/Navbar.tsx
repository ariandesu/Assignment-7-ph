'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { authClient, signOut as authSignOut } from '@/lib/auth-client';
import type { Category } from '@/types';

interface NavbarProps {
  categories: Category[];
}

export function Navbar({ categories }: NavbarProps) {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [showDropdown, setShowDropdown] = useState(false);
  const banglaDate = getBanglaDate();

  const handleSignOut = async () => {
    try {
      await authSignOut();
      window.location.href = '/';
    } catch {
      window.location.href = '/';
    }
  };

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

          {/* Auth Buttons / User Menu */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1.5 pr-3"
                >
                  {user.image ? (
                    <img src={user.image} alt="" className="h-6 w-6 rounded-full" />
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-body-sm font-medium">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                  <span className="hidden sm:inline">{user.name}</span>
                  <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowDropdown(false)}
                      aria-hidden="true"
                    />
                    <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white border border-neutral-200 shadow-lg z-50 py-1">
                      <div className="px-3 py-2 border-b border-neutral-100">
                        <p className="text-body-sm font-medium text-neutral-900">{user.name}</p>
                        <p className="text-caption text-neutral-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-3 py-2 text-body-sm text-neutral-700 hover:bg-neutral-50"
                        onClick={() => setShowDropdown(false)}
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        প্রোফাইল
                      </Link>
                      <Link
                        href="/profile/update"
                        className="flex items-center gap-2 px-3 py-2 text-body-sm text-neutral-700 hover:bg-neutral-50"
                        onClick={() => setShowDropdown(false)}
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        অ্যাকাউন্ট সেটিংস
                      </Link>
                      <hr className="my-1 border-neutral-100" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full px-3 py-2 text-body-sm text-red-600 hover:bg-red-50"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        সাইন আউট
                      </button>
                    </div>
                  </>
                )}
              </div>
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