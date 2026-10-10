import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { CategoryView } from '@/components/category/CategoryView';
import type { Metadata } from 'next';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ sort?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { category } = await api.getCategory(slug);
    return {
      title: `${category.nameBn || category.name} — বাজার দর`,
      description: `${category.nameBn || category.name} ক্যাটাগরির আজকের বাজার দাম ও পরিবর্তন।`,
    };
  } catch {
    return {
      title: 'ক্যাটাগরি — বাজার দর',
    };
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const sortParam = resolvedSearchParams?.sort;
  const initialSort = sortParam === 'price-asc' || sortParam === 'price-desc' ? sortParam : 'default';

  let categories;
  let categoryData;
  try {
    [categories, categoryData] = await Promise.all([
      api.getCategories(),
      api.getCategory(slug),
    ]);
  } catch {
    notFound();
  }

  if (!categoryData?.category) {
    notFound();
  }

  const category = categoryData.category;
  const products = categoryData.products;
  return (
    <CategoryView
      category={category}
      products={products}
      categories={categories}
      initialSort={initialSort}
    />
  );
}
