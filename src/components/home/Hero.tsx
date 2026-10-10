'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface HeroProps {
  imageUrl?: string;
}

export function Hero({ imageUrl = '/bazar-hero.png' }: HeroProps) {
  const scrollToProducts = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const section = document.getElementById('সব-পণ্য');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-primary-50 via-white to-white py-12 lg:py-20" aria-labelledby="hero-heading">
      <div className="container-main">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            <p className="text-body-sm font-medium text-primary-600 mb-3" aria-hidden="true">
              আজকের বাজার দাম
            </p>
            <h1 id="hero-heading" className="text-display-sm lg:display-md font-bold text-neutral-900 mb-4 leading-tight">
              প্রতিদিনের বাজার দাম<br />
              <span className="text-primary-600">এক নজরে জানুন</span>
            </h1>
            <p className="text-body-lg text-neutral-600 mb-6 max-w-lg mx-auto lg:mx-0">
              বাংলাদেশের সব বাজারের আজকের পণ্যের দাম, দামের পরিবর্তন এবং টрен্ড এক জায়গায়। স্মার্ট কেনাকাটা করুন।
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Button size="lg" onClick={scrollToProducts} className="w-full sm:w-auto">
                সব পণ্য দেখুন
              </Button>
              <Link href="/category/all" className="w-full sm:w-auto">
                <Button variant="outline" size="lg">
                  ক্যাটাগরি ব্রাউজ করুন
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 flex justify-center lg:justify-end hidden lg:block">
            <div className="relative max-w-md">
              <img
                src={imageUrl}
                alt="বাজার দর - তাজা পণ্য ও দাম"
                className="w-full h-auto rounded-2xl shadow-xl border border-neutral-200"
                loading="eager"
              />
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-neutral-200 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 text-2xl" aria-hidden="true">📊</div>
                  <div>
                    <p className="text-caption text-neutral-500">আজকের টপ রাইজার</p>
                    <p className="text-heading-sm font-bold text-success">+৫.২%</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-neutral-200 animate-slide-up">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-600 text-2xl" aria-hidden="true">🔔</div>
                  <div>
                    <p className="text-caption text-neutral-500">দাম আপডেট 알림</p>
                    <p className="text-body-sm font-medium text-neutral-900">চালু করুন</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Image */}
          <div className="lg:hidden order-first">
            <img
              src={imageUrl}
              alt="বাজার দর - তাজা পণ্য ও দাম"
              className="w-full max-w-md mx-auto rounded-2xl shadow-lg border border-neutral-200"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}