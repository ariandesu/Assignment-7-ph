'use client';

import { useState } from 'react';
import { Navbar, PriceTickerWrapper, Footer } from '@/components/layout';
import { ProductGrid, EmptyState } from '@/components/home';
import { Button } from '@/components/ui/Button';
import { sortProducts, toBengaliDigits } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { Product, Category, SortOption } from '@/types';

interface CategoryViewProps {
  category: Category | null;
  products: Product[];
  categories: Category[];
  initialSort?: SortOption;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'ডিফল্ট' },
  { value: 'price-asc', label: 'দাম: কম থেকে বেশি' },
  { value: 'price-desc', label: 'দাম: বেশি থেকে কম' },
];

const sortLabels: Record<SortOption, string> = {
  default: 'ডিফল্ট',
  'price-asc': 'দাম: কম থেকে বেশি',
  'price-desc': 'দাম: বেশি থেকে কম',
};

export function CategoryView({
  category,
  products,
  categories,
  initialSort = 'default',
}: CategoryViewProps) {
  const [sortOption, setSortOption] = useState<SortOption>(initialSort);
  const [sortOpen, setSortOpen] = useState(false);
  const sortedProducts = sortProducts(products, sortOption);

  if (!category) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar categories={categories} />
        <main className="flex flex-1 items-center justify-center min-h-[60vh]">
          <EmptyState
            message="ক্যাটাগরি পাওয়া যায়নি"
            description="আপনি যে ক্যাটাগরিটি খুঁজছেন তা বিদ্যমান নেই।"
            actionHref="/"
            actionText="হোম পেজে ফিরে যান"
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar categories={categories} />
      {products.length > 0 && <PriceTickerWrapper products={products} />}
      <main className="flex-1">
        <div className="border-b border-neutral-200 bg-neutral-50">
          <div className="container-main py-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl" aria-hidden="true">
                  {category.emoji || category.icon || '📦'}
                </span>
                <div>
                  <h1 className="text-heading-xl font-bold text-neutral-900">
                    {category.nameBn || category.name}
                  </h1>
                  <p className="mt-1 text-body-md text-neutral-500">
                    মোট {toBengaliDigits(products.length)} টি পণ্য
                  </p>
                </div>
              </div>

              {/* C1 Sort Dropdown */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex min-w-[200px] w-full items-center justify-between gap-2 sm:w-auto"
                  onClick={() => setSortOpen(!sortOpen)}
                  aria-expanded={sortOpen}
                  aria-haspopup="listbox"
                >
                  <span>
                    সাজান: <span className="font-semibold text-primary-700">{sortLabels[sortOption]}</span>
                  </span>
                  <svg
                    className={cn('h-4 w-4 transition-transform', sortOpen && 'rotate-180')}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>

                {sortOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setSortOpen(false)}
                      aria-hidden="true"
                    />
                    <div
                      role="listbox"
                      className="absolute right-0 z-50 mt-1 w-full rounded-lg border border-neutral-200 bg-white py-1 shadow-lg sm:w-56"
                    >
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          role="option"
                          aria-selected={sortOption === option.value}
                          onClick={() => {
                            setSortOption(option.value);
                            setSortOpen(false);
                          }}
                          className={cn(
                            'w-full px-4 py-2 text-left text-body-sm transition-colors',
                            sortOption === option.value
                              ? 'bg-primary-50 font-medium text-primary-700'
                              : 'text-neutral-700 hover:bg-neutral-50'
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container-main py-8">
          <ProductGrid
            products={sortedProducts}
            title=""
            subtitle=""
            emptyMessage="এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
