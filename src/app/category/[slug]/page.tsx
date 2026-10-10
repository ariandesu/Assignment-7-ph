'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { Navbar, PriceTickerWrapper, Footer } from '@/components/layout';
import { ProductGrid, EmptyState } from '@/components/home';
import { SkeletonGrid } from '@/components/ui/Skeleton';
import { api, sortProducts, toBengaliDigits } from '@/lib/api';
import type { Product, Category, SortOption } from '@/types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

async function getCategoryData(slug: string) {
  try {
    const [categories, categoryData] = await Promise.all([
      api.getCategories(),
      api.getCategory(slug),
    ]);
    return { categories, ...categoryData };
  } catch (error) {
    console.error('Failed to fetch category data:', error);
    return { categories: [], category: null, products: [] };
  }
}

function CategoryContent({ category, products, categories, initialSort }: { 
  category: Category | null; 
  products: Product[]; 
  categories: Category[];
  initialSort: SortOption;
}) {
  const searchParams = useSearchParams();
  const [sortOption, setSortOption] = useState<SortOption>(initialSort);
  const [sortedProducts, setSortedProducts] = useState<Product[]>(products);
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    setSortedProducts(sortProducts(products, sortOption));
  }, [products, sortOption]);

  if (!category) {
    return (
      <>
        <Navbar categories={categories} user={null} />
        <PriceTickerWrapper products={[]} />
        <main className="flex-1 flex items-center justify-center min-h-[60vh]">
          <EmptyState
            message="ক্যাটাগরি পাওয়া যায়নি"
            description="আপনি যে ক্যাটাগরিটি খুঁজছেন তা বিদ্যমান নেই বা মুছে ফেলা হয়েছে।"
            actionHref="/"
            actionText="হোম পেজে ফিরে যান"
          />
        </main>
        <Footer />
      </>
    );
  }

  const sortOptions = [
    { value: 'default' as SortOption, label: 'ডিফল্ট' },
    { value: 'price-asc' as SortOption, label: 'দাম: কম থেকে বেশি' },
    { value: 'price-desc' as SortOption, label: 'দাম: বেশি থেকে কম' },
  ];

  const sortLabels = {
    default: 'ডিফল্ট',
    'price-asc': 'দাম: কম থেকে বেশি',
    'price-desc': 'দাম: বেশি থেকে কম',
  };

  return (
    <>
      <Navbar categories={categories} user={null} />
      <PriceTickerWrapper products={products} />
      <main className="flex-1">
        <div className="bg-neutral-50 border-b border-neutral-200">
          <div className="container-main py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl" aria-hidden="true">{category.emoji}</span>
                <div>
                  <h1 className="text-heading-xl font-bold text-neutral-900">{category.nameBn || category.name}</h1>
                  <p className="text-body-md text-neutral-500 mt-1">
                    মোট {toBengaliDigits(products.length)} টি পণ্য
                  </p>
                </div>
              </div>
              
              {/* Sort Dropdown */}
              <div className="relative">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2 w-full sm:w-auto min-w-[200px]"
                  onClick={() => setSortOpen(!sortOpen)}
                >
                  <span>সাজান:</span>
                  <span className="font-medium">{sortLabels[sortOption]}</span>
                  <svg className={cn('h-4 w-4 transition-transform', sortOpen && 'rotate-180')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <div className="absolute right-0 z-50 mt-1 w-full sm:w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 animate-fade-in">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortOption(option.value);
                            setSortOpen(false);
                          }}
                          className={cn(
                            'w-full px-4 py-2 text-left text-body-sm transition-colors',
                            sortOption === option.value
                              ? 'bg-primary-50 text-primary-700 font-medium'
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
          {products.length === 0 ? (
            <EmptyState
              message="এই ক্যাটাগরিতে কোনো পণ্য নেই"
              description="এই ক্যাটাগরিতে সদ্য কোনো পণ্য যোগ করা হয়নি। অন্য ক্যাটাগরি ব্রাউজ করুন।"
              actionHref="/"
              actionText="হোম পেজে ফিরে যান"
            />
          ) : (
            <ProductGrid
              products={sortedProducts}
              title=""
              showViewAll={false}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const searchParams = useSearchParams();
  const initialSort = (searchParams.get('sort') as SortOption) || 'default';
  
  const { categories, category, products } = await getCategoryData(slug);

  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryContent 
        category={category} 
        products={products} 
        categories={categories}
        initialSort={initialSort}
      />
    </Suspense>
  );
}

function CategorySkeleton() {
  return (
    <>
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200 animate-pulse">
        <div className="container-main py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-neutral-200" />
              <div className="space-y-1">
                <div className="h-6 w-32 bg-neutral-200 rounded" />
                <div className="h-4 w-40 bg-neutral-200 rounded" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-24 bg-neutral-200 rounded-lg" />
              <div className="h-10 w-24 bg-neutral-200 rounded-lg" />
            </div>
          </div>
        </div>
        <div className="bg-neutral-50 border-b border-neutral-200">
          <div className="container-main py-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-10 w-24 bg-neutral-200 rounded-lg flex-shrink-0" />
              ))}
            </div>
          </div>
        </div>
      </div>
      
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
        <div className="bg-neutral-50 border-b border-neutral-200">
          <div className="container-main py-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-neutral-200" />
              <div className="space-y-1">
                <div className="h-7 w-48 bg-neutral-200 rounded" />
                <div className="h-5 w-40 bg-neutral-200 rounded" />
              </div>
            </div>
            <div className="h-10 w-48 bg-neutral-200 rounded-lg mt-4 sm:mt-0" />
          </div>
        </div>
        <div className="container-main py-8">
          <SkeletonGrid columns={4} rows={3} />
        </div>
      </main>
      
      <footer className="bg-neutral-900 animate-pulse">
        <div className="container-main py-10 lg:py-14">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="text-center md:text-left space-y-4">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <div className="h-10 w-10 rounded-lg bg-neutral-700" />
                <div className="h-7 w-40 bg-neutral-700 rounded" />
              </div>
              <div className="h-6 w-56 bg-neutral-700 rounded mx-auto md:mx-0" />
            </div>
            <div className="text-center md:text-right space-y-3">
              <div className="h-5 w-72 bg-neutral-700 rounded mx-auto md:mx-0" />
              <div className="h-4 w-48 bg-neutral-700 rounded mx-auto md:mx-0" />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}