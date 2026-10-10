import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { api } from '@/lib/api';
import { ProductDetailView } from '@/components/product/ProductDetailView';
import type { Metadata } from 'next';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await api.getProduct(slug);
    return {
      title: `${product.name} — বাজার দর`,
      description: `${product.name} এর আজকের বাজার দাম, সর্বনিম্ন, সর্বোচ্চ ও গড় হিসাব।`,
    };
  } catch {
    return {
      title: 'পণ্যের বিবরণ — বাজার দর',
    };
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  // Protected route check per Requirement 4: requires login
  const cookieStore = await cookies();
  const sessionToken =
    cookieStore.get('better-auth.session_token') ||
    cookieStore.get('__Secure-better-auth.session_token') ||
    cookieStore.get('better-auth.session-token');

  if (!sessionToken?.value) {
    redirect(`/signin?callbackUrl=${encodeURIComponent(`/product/${slug}`)}&authRequired=true`);
  }

  let categories;
  let product;
  try {
    [categories, product] = await Promise.all([
      api.getCategories(),
      api.getProduct(slug),
    ]);
  } catch {
    notFound();
  }

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} categories={categories} />;
}
