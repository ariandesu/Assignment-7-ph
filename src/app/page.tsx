import { Footer, Navbar, PriceTickerWrapper } from '@/components/layout';
import { Hero, ProductGrid } from '@/components/home';
import { api } from '@/lib/api';
import { toBengaliDigits } from '@/lib/utils';
import type { Product, Category } from '@/types';

async function getHomeData(): Promise<{
  products: Product[];
  categories: Category[];
  error?: string;
}> {
  try {
    const [products, categories] = await Promise.all([
      api.getProducts(),
      api.getCategories(),
    ]);
    return { products, categories };
  } catch {
    return {
      products: [],
      categories: [],
      error: 'দাম লোড করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।',
    };
  }
}

function PriceError({ message }: { message: string }) {
  return (
    <div className="container-main py-12" role="alert">
      <div className="rounded-xl border border-danger-light bg-danger-light/40 p-6 text-center">
        <p className="text-body-lg font-semibold text-danger-dark">{message}</p>
        <p className="mt-2 text-body-sm text-neutral-600">
          প্রথম সার্ভার ব্যর্থ হলে দ্বিতীয় API স্বয়ংক্রিয়ভাবে চেষ্টা করা হয়েছে।
        </p>
      </div>
    </div>
  );
}

function movers(products: Product[], direction: 'up' | 'down') {
  return products
    .filter((product) =>
      direction === 'up'
        ? product.changeDirection === 'up' || product.changePercent > 0
        : product.changeDirection === 'down' || product.changePercent < 0
    )
    .sort((a, b) =>
      direction === 'up'
        ? b.changePercent - a.changePercent
        : Math.abs(b.changePercent) - Math.abs(a.changePercent)
    )
    .slice(0, 6);
}

export default async function Home() {
  const { products, categories, error } = await getHomeData();
  const risers = movers(products, 'up');
  const fallers = movers(products, 'down');

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar categories={categories} />
      {products.length > 0 && <PriceTickerWrapper products={products} />}
      <main className="flex-1">
        <Hero />
        {error ? (
          <PriceError message={error} />
        ) : (
          <div className="container-main pb-16">
            {risers.length > 0 && (
              <ProductGrid
                products={risers}
                title="আজ দাম বেড়েছে ▲"
                subtitle="গতকালের তুলনায় যেসব পণ্যের দাম বৃদ্ধি পেয়েছে"
              />
            )}
            {fallers.length > 0 && (
              <ProductGrid
                products={fallers}
                title="আজ দাম কমেছে ▼"
                subtitle="গতকালের তুলনায় যেসব পণ্যের দাম কমেছে"
              />
            )}
            <div id="সব-পণ্য" className="scroll-mt-40">
              <ProductGrid
                products={products}
                title="সব পণ্য"
                subtitle={`মোট ${toBengaliDigits(products.length)}টি পণ্য দেখানো হচ্ছে`}
              />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
