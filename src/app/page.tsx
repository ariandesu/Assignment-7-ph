import { Suspense } from 'react';
import { Navbar, PriceTickerWrapper, Footer } from '@/components/layout';
import { Hero, ProductGrid } from '@/components/home';
import { SkeletonGrid } from '@/components/ui/Skeleton';
import { api, toBengaliDigits } from '@/lib/api';
import type { Product, Category } from '@/types';

// Server component to fetch data
async function getHomeData() {
  try {
    const [products, categories] = await Promise.all([
      api.getProducts(),
      api.getCategories(),
    ]);
    return { products, categories };
  } catch (error) {
    console.error('Failed to fetch home data:', error);
    return { products: [], categories: [] };
  }
}

// Client component for PriceTicker (needs interactivity)
'use client';
import { useEffect, useState } from 'react';
import { PriceTicker as PriceTickerClient } from '@/components/layout/PriceTicker';
import type { Product } from '@/types';

interface PriceTickerWrapperProps {
  products: Product[];
}

export function PriceTickerWrapper({ products }: PriceTickerWrapperProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <div className="bg-accent-50 border-y border-accent-200 py-3" aria-hidden="true">
        <div className="container-main">
          <div className="flex items-center gap-4 animate-pulse">
            <div className="h-5 w-24 bg-accent-200 rounded" />
            <div className="h-5 w-32 bg-accent-200 rounded" />
            <div className="h-5 w-20 bg-accent-200 rounded" />
            <div className="h-5 w-16 bg-accent-200 rounded" />
          </div>
        </div>
      </div>
    );
  }
  
  return <PriceTickerClient products={products} />;
}

// Home page content
async function HomeContent() {
  const { products, categories } = await getHomeData();
  
  // Sort products by change percent for risers and fallers
  const risers = [...products]
    .filter(p => p.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 6);
    
  const fallers = [...products]
    .filter(p => p.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 6);

  return (
    <>
      <Navbar categories={categories} user={null} />
      <PriceTickerWrapper products={products} />
      <main id="main-content" className="flex-1">
        <Hero />
        
        {/* Section A: Top Risers */}
        <section id="আজ-দাম-বেড়েছে" aria-labelledby="risers-heading" className="py-8 bg-white">
          <div className="container-main">
            <ProductGrid
              products={risers}
              title="আজ দাম বেড়েছে ▲"
              subtitle="সর্বোচ্চ দাম বৃদ্ধি পাওয়া ৬টি পণ্য"
              showViewAll
              viewAllHref="/category/all?sort=price-desc"
              viewAllText="সব রাইজার দেখুন"
            />
          </div>
        </section>

        {/* Section B: Top Fallers */}
        <section id="আজ-দাম-কমেছে" aria-labelledby="fallers-heading" className="py-8 bg-neutral-50">
          <div className="container-main">
            <ProductGrid
              products={fallers}
              title="আজ দাম কমেছে ▼"
              subtitle="সর্বোচ্চ দাম কমে যাওয়া ৬টি পণ্য"
              showViewAll
              viewAllHref="/category/all?sort=price-asc"
              viewAllText="সব ফলার দেখুন"
            />
          </div>
        </section>

        {/* Section C: All Products */}
        <section id="সব-পণ্য" aria-labelledby="all-products-heading" className="py-8 bg-white">
          <div className="container-main">
            <ProductGrid
              products={products}
              title="সব পণ্য"
              subtitle={`মোট ${toBengaliDigits(products.length)} টি পণ্য`} 
              showViewAll={false}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

// Loading skeleton for home page
function HomeSkeleton() {
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

export default async function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}