'use client';

import Link from 'next/link';
import { Navbar, PriceTickerWrapper, Footer } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatPrice, formatPriceChange } from '@/lib/api';
import type { Product, Category } from '@/types';

interface ProductDetailViewProps {
  product: Product;
  categories: Category[];
}

export function ProductDetailView({ product, categories }: ProductDetailViewProps) {
  const { label: changeLabel, direction } = formatPriceChange(product.changePercent);
  const categoryTags = product.category ? [product.category] : [];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar categories={categories} />
      {product && <PriceTickerWrapper products={[product]} />}
      <main className="flex-1 pb-16">
        {/* Breadcrumb Navigation */}
        <nav aria-label="ব্রেডক্রাম্ব" className="border-b border-neutral-200 bg-neutral-50">
          <div className="container-main py-3">
            <ol className="flex items-center gap-2 text-body-sm text-neutral-600">
              <li>
                <Link href="/" className="transition-colors hover:text-primary-700">
                  হোম
                </Link>
              </li>
              <li aria-hidden="true" className="text-neutral-400">/</li>
              <li>
                <Link
                  href={`/category/${product.categorySlug}`}
                  className="transition-colors hover:text-primary-700"
                >
                  {product.category}
                </Link>
              </li>
              <li aria-hidden="true" className="text-neutral-400">/</li>
              <li className="max-w-[200px] truncate font-medium text-neutral-900" aria-current="page">
                {product.name}
              </li>
            </ol>
          </div>
        </nav>

        <div className="container-main py-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left 2 cols: Main details */}
            <div className="space-y-6 lg:col-span-2">
              {/* Product Header Card */}
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-neutral-100 text-6xl">
                      {product.emoji || '📦'}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                        {categoryTags.map((tag) => (
                          <Badge key={tag} variant="neutral" size="sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <h1 className="text-heading-xl font-bold text-neutral-900">
                        {product.name}
                      </h1>
                      <p className="text-body-md text-neutral-600">
                        {product.description || `${product.category} ক্যাটাগরির পণ্য। আজকের বাজারের দাম ও পরিবর্তন।`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-heading-md font-bold text-neutral-900">
                    দামের সারসংক্ষেপ
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-success/20 bg-success-light/40 p-4 text-center">
                      <p className="text-caption font-medium text-success-dark">সর্বনিম্ন দাম</p>
                      <p className="mt-1 text-heading-lg font-bold text-success-dark">
                        {formatPrice(product.minPrice)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-primary/20 bg-primary-50 p-4 text-center">
                      <p className="text-caption font-medium text-primary-700">গড় দাম</p>
                      <p className="mt-1 text-heading-lg font-bold text-primary-700">
                        {formatPrice(product.avgPrice)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-danger/20 bg-danger-light/40 p-4 text-center">
                      <p className="text-caption font-medium text-danger-dark">সর্বোচ্চ দাম</p>
                      <p className="mt-1 text-heading-lg font-bold text-danger-dark">
                        {formatPrice(product.maxPrice)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Market breakdown table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-heading-md font-bold text-neutral-900">
                    বাজারভিত্তিক আজকের দাম
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {product.markets && product.markets.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-body-sm">
                        <thead className="border-b border-neutral-200 bg-neutral-50 text-caption font-semibold text-neutral-600">
                          <tr>
                            <th className="py-3 px-4">বাজার</th>
                            <th className="py-3 px-4">বিভাগ</th>
                            <th className="py-3 px-4 text-right">সর্বনিম্ন</th>
                            <th className="py-3 px-4 text-right">সর্বোচ্চ</th>
                            <th className="py-3 px-4 text-right">গড়</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {product.markets.map((m, idx) => (
                            <tr key={`${m.market}-${idx}`} className="hover:bg-neutral-50/60">
                              <td className="py-3 px-4 font-medium text-neutral-900">{m.market}</td>
                              <td className="py-3 px-4 text-neutral-600">{m.division}</td>
                              <td className="py-3 px-4 text-right text-success-dark font-medium">
                                {formatPrice(m.min)}
                              </td>
                              <td className="py-3 px-4 text-right text-danger-dark font-medium">
                                {formatPrice(m.max)}
                              </td>
                              <td className="py-3 px-4 text-right font-bold text-neutral-900">
                                {formatPrice(Math.round((m.min + m.max) / 2))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-body-sm text-neutral-500">বাজারভিত্তিক তথ্য পাওয়া যায়নি।</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right 1 col: Price card & Action */}
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <span className="text-caption font-medium text-neutral-500">আজকের দাম</span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-display-sm font-bold text-neutral-900">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-body-sm text-neutral-500">/ {product.unit}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        direction === 'up' ? 'success' : direction === 'down' ? 'danger' : 'neutral'
                      }
                      size="md"
                    >
                      {changeLabel}
                    </Badge>
                    <span className="text-caption text-neutral-500">গতকালের তুলনায়</span>
                  </div>

                  <hr className="border-neutral-200" />

                  <div className="space-y-2 text-body-sm text-neutral-600">
                    <div className="flex justify-between">
                      <span>ক্যাটাগরি:</span>
                      <span className="font-medium text-neutral-900">{product.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>হিসাবের একক:</span>
                      <span className="font-medium text-neutral-900">{product.unit}</span>
                    </div>
                  </div>

                  <Link
                    href={`/category/${product.categorySlug}`}
                    className="block w-full text-center text-body-sm font-medium text-primary-700 hover:underline pt-2"
                  >
                    ← {product.category} ক্যাটাগরির অন্য পণ্য দেখুন
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
