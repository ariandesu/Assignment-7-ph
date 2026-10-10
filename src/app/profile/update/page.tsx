'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Navbar, Footer } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ProfileUpdatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('নাম আবশ্যক');
      return;
    }

    if (formData.name.trim().length < 2) {
      setError('নাম কমপক্ষে ২ অক্ষরের হতে হবে');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'প্রোফাইল আপডেট ব্যর্থ হয়েছে');
      }

      toast.success('প্রোফাইল সফলভাবে আপডেট হয়েছে!');
      router.push('/profile');
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'প্রোফাইল আপডেট ব্যর্থ হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar categories={[]} user={null} />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Card variant="outlined" padding="lg">
            <CardHeader className="text-center mb-8">
              <CardTitle className="text-heading-xl">প্রোফাইল আপডেট</CardTitle>
              <CardDescription>
                আপনার নাম আপডেট করুন
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {error && (
                  <div className="p-3 bg-danger-light text-danger text-body-sm rounded-lg" role="alert">
                    {error}
                  </div>
                )}

                <Input
                  label="নাম"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="আপনার পূর্ণ নাম"
                  disabled={isLoading}
                />

                <Button type="submit" className="w-full" size="lg" loading={isLoading}>
                  আপডেট করুন
                </Button>
              </form>

              <div className="text-center">
                <Link href="/profile">
                  <Button variant="ghost" className="w-full sm:w-auto">
                    ← প্রোফাইলে ফিরে যান
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}