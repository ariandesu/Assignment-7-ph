import { Footer, Navbar, PriceTickerWrapper } from '@/components/layout';
import { Hero, ProductGrid } from '@/components/home';
import { api } from '@/lib/api';
import type { Product } from '@/types';

async function getHomeData(): Promise<{
  products: Product[];
  categories: Awaited<ReturnType<typeof api.getCategories>>;
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
    .filter((product) => product.changeDirection === direction)
    .sort((a, b) => direction === 'up'
      ? b.changePercent - a.changePercent
      : a.changePercent - b.changePercent)
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
            <ProductGrid
              products={risers}
              title="আজ দাম বেড়েছে ▲"
              subtitle="আজকের সবচেয়ে বেশি বাড়তি দামের পণ্য"
            />
            <ProductGrid
              products={fallers}
              title="আজ দাম কমেছে ▼"
              subtitle="আজকের সবচেয়ে বেশি কমতি দামের পণ্য"
            />
            <div id="সব-পণ্য" className="scroll-mt-40">
              <ProductGrid
                products={products}
                title="সব পণ্য"
                subtitle="চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম এক জায়গায়।"
              />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
