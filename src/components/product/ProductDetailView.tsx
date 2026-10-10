'use client';

import Link from 'next/link';
import { Navbar, PriceTickerWrapper, Footer } from '@/components/layout';
import { formatPrice, formatPriceChange } from '@/lib/api';
import { toBengaliDigits } from '@/lib/utils';
import type { Product, Category } from '@/types';

interface ProductDetailViewProps {
  product: Product;
  categories: Category[];
}

export function ProductDetailView({ product, categories }: ProductDetailViewProps) {
  const { label: changeLabel } = formatPriceChange(product.changePercent);
  const isUp = product.changePercent > 0;
  const isDown = product.changePercent < 0;
  const arrow = isUp ? '▲' : isDown ? '▼' : '—';
  const badgeColor = isUp ? 'text-[#1A9951]' : isDown ? 'text-[#D03739]' : 'text-[#1D271F]';
  const priceFormatted = toBengaliDigits(product.price.toLocaleString('en-US'));

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <Navbar categories={categories} />
      {product && <PriceTickerWrapper products={[product]} />}

      <main className="flex-1 pb-16">
        {/* Breadcrumb Navigation - mobile responsive horizontal scroll */}
        <nav aria-label="ব্রেডক্রাম্ব" className="border-b border-neutral-200 bg-white">
          <div className="container-main py-3">
            <ol className="flex items-center gap-2 overflow-x-auto whitespace-nowrap text-xs sm:text-body-sm text-neutral-600 scrollbar-hide">
              <li className="shrink-0">
                <Link href="/" className="transition-colors hover:text-primary-700">
                  হোম
                </Link>
              </li>
              <li aria-hidden="true" className="text-neutral-400 shrink-0">/</li>
              <li className="shrink-0">
                <Link
                  href={`/category/${product.categorySlug}`}
                  className="transition-colors hover:text-primary-700"
                >
                  {product.category}
                </Link>
              </li>
              <li aria-hidden="true" className="text-neutral-400 shrink-0">/</li>
              <li className="font-medium text-neutral-900 shrink-0 truncate max-w-[200px] sm:max-w-none" aria-current="page">
                {product.name}
              </li>
            </ol>
          </div>
        </nav>

        <div className="container-main py-6 sm:py-8 space-y-6 sm:space-y-8">
          {/* 1. Header Card - Pixel-matched to Figma Header frame (1120x174) */}
          <div className="rounded-2xl border border-[#E1E8E1] bg-[#FAFCFA] p-5 sm:p-7 shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              {/* Left & Middle: Emoji + Title/Subtitle */}
              <div className="flex items-start sm:items-center gap-4 sm:gap-5 min-w-0">
                <div
                  className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-[#F0F5F0] text-3xl sm:text-5xl"
                  aria-hidden="true"
                >
                  {product.emoji || '📦'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full">
                      {product.category}
                    </span>
                    <span className="text-xs text-neutral-500">
                      প্রতি {product.unit}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#1D271F] truncate">
                    {product.name}
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-neutral-600 line-clamp-2">
                    {product.description || `${product.category} ক্যাটাগরির পণ্য। আজকের বাজারের দাম ও পরিবর্তন।`}
                  </p>
                </div>
              </div>

              {/* Right: Today's Price Box (Prominent on both mobile and desktop) */}
              <div className="flex items-center justify-between sm:justify-start md:flex-col md:items-end gap-2 border-t border-neutral-200 pt-4 md:border-t-0 md:pt-0 shrink-0">
                <div className="text-left md:text-right">
                  <span className="text-xs font-normal text-neutral-500">আজকের দাম</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-bold text-[#1D271F]">
                      {priceFormatted}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-neutral-600">
                      টাকা / {product.unit}
                    </span>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-1 rounded-xl bg-[#F0F5F0] px-2.5 py-1 text-xs sm:text-sm font-semibold ${badgeColor}`}
                  aria-label={`পরিবর্তন ${arrow} ${changeLabel}`}
                >
                  <span aria-hidden="true">{arrow}</span>
                  <span>{changeLabel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Price Summary Section - Pixel-matched to Figma Price Summary Stat cards (351x102) */}
          <section aria-labelledby="stats-heading">
            <h2 id="stats-heading" className="text-lg sm:text-xl font-bold text-[#1D271F] mb-3 sm:mb-4">
              দামের সারসংক্ষেপ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Card 1: সর্বনিম্ন দাম */}
              <div className="rounded-2xl border border-[#E1E8E1] bg-[#FAFCFA] p-4 sm:p-5 shadow-sm">
                <p className="text-xs font-medium text-neutral-500">সর্বনিম্ন দাম</p>
                <p className="mt-1 text-xl sm:text-2xl font-bold text-success-dark">
                  {formatPrice(product.minPrice)}
                </p>
                <p className="mt-1 text-[11px] sm:text-xs text-neutral-500">সবচেয়ে কম দামের বাজার</p>
              </div>

              {/* Card 2: গড় দাম */}
              <div className="rounded-2xl border border-[#E1E8E1] bg-[#FAFCFA] p-4 sm:p-5 shadow-sm">
                <p className="text-xs font-medium text-neutral-500">গড় দাম</p>
                <p className="mt-1 text-xl sm:text-2xl font-bold text-primary-700">
                  {formatPrice(product.avgPrice)}
                </p>
                <p className="mt-1 text-[11px] sm:text-xs text-neutral-500">প্রতি {product.unit}-এর হিসাবে</p>
              </div>

              {/* Card 3: সর্বাধিক দাম */}
              <div className="rounded-2xl border border-[#E1E8E1] bg-[#FAFCFA] p-4 sm:p-5 shadow-sm">
                <p className="text-xs font-medium text-neutral-500">সর্বাধিক দাম</p>
                <p className="mt-1 text-xl sm:text-2xl font-bold text-danger-dark">
                  {formatPrice(product.maxPrice)}
                </p>
                <p className="mt-1 text-[11px] sm:text-xs text-neutral-500">সবচেয়ে বেশি দামের বাজার</p>
              </div>
            </div>
          </section>

          {/* 3. Market Breakdown Section - Mobile Card List + Desktop Table */}
          <section aria-labelledby="markets-heading">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 id="markets-heading" className="text-lg sm:text-xl font-bold text-[#1D271F]">
                বাজারভিত্তিক আজকের দাম
              </h2>
              <span className="text-xs text-neutral-500">
                মোট {toBengaliDigits(product.markets?.length || 0)}টি বাজার
              </span>
            </div>

            <div className="rounded-2xl border border-[#E1E8E1] bg-[#FAFCFA] shadow-sm overflow-hidden">
              {product.markets && product.markets.length > 0 ? (
                <>
                  {/* Mobile View: Clean responsive cards for small viewports (< 640px) */}
                  <div className="block sm:hidden divide-y divide-[#E1E8E1]">
                    {product.markets.map((m, idx) => (
                      <div key={`${m.market}-${idx}`} className="p-4 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-[#1D271F]">{m.market}</span>
                          <span className="text-xs px-2 py-0.5 rounded-md bg-[#F0F5F0] text-neutral-600 font-medium">
                            {m.division}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                          <div className="bg-success-light/30 rounded-xl p-2">
                            <p className="text-[11px] text-success-dark font-medium">সর্বনিম্ন</p>
                            <p className="font-bold text-xs text-success-dark mt-0.5">{formatPrice(m.min)}</p>
                          </div>
                          <div className="bg-primary-50 rounded-xl p-2">
                            <p className="text-[11px] text-primary-700 font-medium">গড়</p>
                            <p className="font-bold text-xs text-primary-700 mt-0.5">
                              {formatPrice(Math.round((m.min + m.max) / 2))}
                            </p>
                          </div>
                          <div className="bg-danger-light/30 rounded-xl p-2">
                            <p className="text-[11px] text-danger-dark font-medium">সর্বোচ্চ</p>
                            <p className="font-bold text-xs text-danger-dark mt-0.5">{formatPrice(m.max)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop / Tablet View: Full Figma Table (>= 640px) */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-[#E1E8E1] bg-[#F0F5F0] text-xs font-semibold text-neutral-700">
                        <tr>
                          <th className="py-3 px-5">বাজার</th>
                          <th className="py-3 px-5">বিভাগ</th>
                          <th className="py-3 px-5 text-right">সর্বনিম্ন</th>
                          <th className="py-3 px-5 text-right">সর্বোচ্চ</th>
                          <th className="py-3 px-5 text-right">গড়</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E1E8E1]">
                        {product.markets.map((m, idx) => (
                          <tr key={`${m.market}-${idx}`} className="hover:bg-white transition-colors">
                            <td className="py-3.5 px-5 font-medium text-[#1D271F]">{m.market}</td>
                            <td className="py-3.5 px-5 text-neutral-600">{m.division}</td>
                            <td className="py-3.5 px-5 text-right text-success-dark font-semibold">
                              {formatPrice(m.min)}
                            </td>
                            <td className="py-3.5 px-5 text-right text-danger-dark font-semibold">
                              {formatPrice(m.max)}
                            </td>
                            <td className="py-3.5 px-5 text-right font-bold text-[#1D271F]">
                              {formatPrice(Math.round((m.min + m.max) / 2))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-sm text-neutral-500">
                  বাজারভিত্তিক তথ্য পাওয়া যায়নি।
                </div>
              )}
            </div>
          </section>

          {/* Back Navigation Button */}
          <div className="pt-2 text-center sm:text-left">
            <Link
              href={`/category/${product.categorySlug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:underline"
            >
              ← {product.category} ক্যাটাগরির অন্য পণ্য দেখুন
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
