'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Navbar, Footer } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authClient } from '@/lib/auth-client';

export default function ProfileUpdatePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(session?.user?.name ?? '');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setError('নাম কমপক্ষে ২ অক্ষরের হতে হবে');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const { error: updateError } = await authClient.updateUser({ name: trimmedName });
      if (updateError) throw new Error(updateError.message || 'প্রোফাইল আপডেট ব্যর্থ হয়েছে');
      toast.success('প্রোফাইল সফলভাবে আপডেট হয়েছে!');
      router.push('/profile');
      router.refresh();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'প্রোফাইল আপডেট ব্যর্থ হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) return <main className="container-main py-16 text-center">লোড হচ্ছে…</main>;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar categories={[]} />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card variant="outlined" padding="lg">
            <CardHeader className="mb-8 text-center">
              <CardTitle className="text-heading-xl">তথ্য আপডেট করুন</CardTitle>
              <CardDescription>আপনার প্রোফাইলের নাম পরিবর্তন করুন</CardDescription>
            </CardHeader>
            <CardContent>
              {!session?.user ? (
                <div className="text-center">
                  <p className="mb-4 text-neutral-600">আপনি লগইন করা নেই।</p>
                  <Link href="/signin"><Button>সাইন ইন করুন</Button></Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <Input
                    label="নাম"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={error}
                    placeholder="আপনার নাম"
                    disabled={isLoading}
                  />
                  <Button type="submit" className="w-full" loading={isLoading}>
                    তথ্য আপডেট করুন
                  </Button>
                  <Link href="/profile" className="block text-center text-body-sm text-primary-700 hover:underline">
                    বাতিল করে প্রোফাইলে ফিরুন
                  </Link>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
