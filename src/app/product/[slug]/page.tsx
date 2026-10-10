'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { Navbar, PriceTickerWrapper, Footer } from '@/components/layout';
import { EmptyState } from '@/components/home';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { api, toBengaliDigits, formatPrice, formatPriceChange } from '@/lib/api';
import type { Product, Category, MarketPrice } from '@/types';
import { useState, useEffect } from 'react';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getProductData(slug: string) {
  try {
    const [categories, product] = await Promise.all([
      api.getCategories(),
      api.getProduct(slug),
    ]);
    return { categories, product };
  } catch (error) {
    console.error('Failed to fetch product data:', error);
    return { categories: [], product: null };
  }
}

function ProductDetailContent({ product, categories }: { 
  product: Product | null; 
  categories: Category[];
}) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <>
        <Navbar categories={categories} user={null} />
        <PriceTickerWrapper products={[]} />
        <main className="flex-1 flex items-center justify-center min-h-[60vh]">
          <EmptyState
            message="পণ্য পাওয়া যায়নি"
            description="আপনি যে পণ্যটি খুঁজছেন তা বিদ্যমান নেই বা মুছে ফেলা হয়েছে।"
            actionHref="/"
            actionText="হোম পেজে ফিরে যান"
          />
        </main>
        <Footer />
      </>
    );
  }

  const { label: changeLabel, direction } = formatPriceChange(product.changePercent);
  const categoryTags = product.category ? [product.category] : [];

  return (
    <>
      <Navbar categories={categories} user={null} />
      <PriceTickerWrapper products={[]} />
      <main className="flex-1">
        {/* Breadcrumb */}
        <nav className="bg-neutral-50 border-b border-neutral-200" aria-label="ব্রেডক্রাম্ব">
          <div className="container-main py-4">
            <ol className="flex items-center gap-2 text-body-sm text-neutral-500">
              <li>
                <Link href="/" className="hover:text-primary-600 transition-colors">হোম</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/category/${product.categorySlug}`} className="hover:text-primary-600 transition-colors">
                  {product.category}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-neutral-900 font-medium truncate max-w-[200px]">{product.name}</li>
            </ol>
          </div>
        </nav>

        <div className="container-main py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Summary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Summary Card */}
              <Card variant="hover">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl bg-neutral-100 flex items-center justify-center text-5xl sm:text-7xl" aria-hidden="true">
                        {product.emoji || '📦'}
                      </div>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h1 className="text-heading-xl sm:text-display-sm font-bold text-neutral-900 mb-2">
                        {product.name}
                      </h1>
                      <p className="text-body-md text-neutral-600 mb-4">
                        {product.description || `${product.category} ক্যাটাগরির পণ্য। বাজারের আজকের দাম ও ট্রেন্ড জানুন।`}
                      </p>
                      
                      {/* Category Tags */}
                      <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start mb-4">
                        {categoryTags.map((tag, i) => (
                          <Badge key={i} variant="primary" size="sm">
                            {tag}
                          </Badge>
                        ))}
                        <Badge variant="neutral" size="sm">
                          {product.unit}
                        </Badge>
                      </div>

                      {/* Change Badge */}
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <Badge
                          variant={
                            direction === 'up' ? 'success' :
                            direction === 'down' ? 'danger' : 'neutral'
                          }
                        >
                          {changeLabel}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price Summary Card */}
              <Card variant="hover">
                <CardHeader>
                  <CardTitle>দামের সারসংক্ষেপ</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-success-light rounded-xl">
                      <p className="text-caption text-success-dark mb-1">ন্যূনতম দাম</p>
                      <p className="text-heading-md font-bold text-success">
                        {product.minPrice ? formatPrice(product.minPrice) : '—'}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-warning-light rounded-xl">
                      <p className="text-caption text-warning-dark mb-1">গড় দাম</p>
                      <p className="text-heading-md font-bold text-warning">
                        {product.avgPrice ? formatPrice(product.avgPrice) : '—'}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-danger-light rounded-xl">
                      <p className="text-caption text-danger-dark mb-1">সর্বোচ্চ দাম</p>
                      <p className="text-heading-md font-bold text-danger">
                        {product.maxPrice ? formatPrice(product.maxPrice) : '—'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Market-wise Prices */}
              {product.markets && product.markets.length > 0 && (
                <Card variant="hover">
                  <CardHeader>
                    <CardTitle>বাজারভিত্তিক আজকের দাম</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full" role="table">
                        <thead>
                          <tr className="border-b border-neutral-200">
                            <th className="text-left py-3 px-4 text-body-sm font-medium text-neutral-500">বাজার</th>
                            <th className="text-right py-3 px-4 text-body-sm font-medium text-neutral-500">দাম</th>
                            <th className="text-right py-3 px-4 text-body-sm font-medium text-neutral-500">একক</th>
                          </tr>
                        </thead>
                        <tbody>
                          {product.markets.map((market: MarketPrice, index: number) => (
                            <tr key={index} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                              <td className="py-3 px-4 text-body-md text-neutral-900">{market.market}</td>
                              <td className="py-3 px-4 text-right text-heading-sm font-semibold text-neutral-900">
                                {formatPrice(market.price)}
                              </td>
                              <td className="py-3 px-4 text-right text-body-sm text-neutral-500">{market.unit}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right: Current Price Card */}
            <div className="lg:col-span-1">
              <Card variant="hover" className="sticky top-24">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <p className="text-caption text-neutral-500 mb-1">আজকের দাম</p>
                    <p className="text-display-sm font-bold text-neutral-900">{formatPrice(product.price)}</p>
                    <p className="text-body-sm text-neutral-500 mt-1">প্রতি {product.unit.replace('প্রতি ', '')}</p>
                  </div>
                  
                  <div className="text-center mb-6 p-4 bg-neutral-50 rounded-xl">
                    <Badge
                      variant={
                        direction === 'up' ? 'success' :
                        direction === 'down' ? 'danger' : 'neutral'
                      }
                      className="text-body-sm px-4 py-2"
                    >
                      {changeLabel}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <Link href={`/category/${product.categorySlug}`}>
                      <Button variant="outline" className="w-full">
                        এই ক্যাটাগরির অন্যান্য পণ্য
                      </Button>
                    </Link>
                    <Button variant="secondary" className="w-full">
                      দামের ইতিহাস দেখুন
                    </Button>
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-6 pt-6 border-t border-neutral-200 space-y-3">
                    <div className="flex justify-between text-body-sm">
                      <span className="text-neutral-500">ক্যাটাগরি</span>
                      <span className="font-medium text-neutral-900">{product.category}</span>
                    </div>
                    <div className="flex justify-between text-body-sm">
                      <span className="text-neutral-500">একক</span>
                      <span className="font-medium text-neutral-900">{product.unit}</span>
                    </div>
                    <div className="flex justify-between text-body-sm">
                      <span className="text-neutral-500">পণ্য আইডি</span>
                      <span className="font-medium text-neutral-900 font-mono">#{product.id}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function ProductDetailSkeleton() {
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
        <nav className="bg-neutral-50 border-b border-neutral-200">
          <div className="container-main py-4">
            <div className="flex gap-2">
              <div className="h-4 w-12 bg-neutral-200 rounded" />
              <div className="h-4 w-4 bg-neutral-200 rounded" />
              <div className="h-4 w-16 bg-neutral-200 rounded" />
              <div className="h-4 w-4 bg-neutral-200 rounded" />
              <div className="h-4 w-32 bg-neutral-200 rounded" />
            </div>
          </div>
        </nav>
        
        <div className="container-main py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-neutral-200 rounded-2xl" />
              <div className="h-48 bg-neutral-200 rounded-2xl" />
              <div className="h-64 bg-neutral-200 rounded-2xl" />
            </div>
            <div className="lg:col-span-1">
              <div className="h-80 bg-neutral-200 rounded-2xl sticky top-24" />
            </div>
          </div>
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

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const { categories, product } = await getProductData(slug);

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailContent product={product} categories={categories} />
    </Suspense>
  );
}