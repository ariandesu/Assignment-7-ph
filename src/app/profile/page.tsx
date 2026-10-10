'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Navbar, Footer } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getInitials } from '@/lib/utils';

interface ProfilePageProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  } | null;
}

export default function ProfilePage({ user }: ProfilePageProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      toast.success('সফলভাবে সাইন আউট হয়েছে!');
      router.push('/');
      router.refresh();
    } catch {
      toast.error('সাইন আউট ব্যর্থ হয়েছে');
    }
  };

  if (!user) {
    return (
      <>
        <Navbar categories={[]} user={null} />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="text-center">
            <p className="text-body-lg text-neutral-600 mb-4">আপনি লগইন করা নেই।</p>
            <Link href="/signin">
              <Button>সাইন ইন করুন</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar categories={[]} user={user} />
      <main className="flex-1">
        <div className="container-main py-12">
          <div className="max-w-2xl mx-auto">
            {/* Profile Header */}
            <Card variant="outlined" padding="lg" className="mb-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center text-3xl font-bold text-primary-700">
                      {getInitials(user.name)}
                    </div>
                  )}
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h1 className="text-heading-xl font-bold text-neutral-900">{user.name}</h1>
                  <p className="text-body-md text-neutral-500 mt-1">{user.email}</p>
                  <span className="inline-flex items-center gap-1 mt-3 text-body-sm text-success font-medium">
                    <span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" />
                    সক্রিয় সদস্য
                  </span>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <Card variant="outlined" padding="lg">
              <CardHeader>
                <CardTitle className="text-heading-md">অ্যাকাউন্ট সেটিংস</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/profile/update">
                  <Button variant="outline" className="w-full justify-start">
                    প্রোফাইল আপডেট করুন
                  </Button>
                </Link>
                
                <Button 
                  variant="danger" 
                  className="w-full justify-start"
                  onClick={handleSignOut}
                >
                  সাইন আউট
                </Button>
              </CardContent>
            </Card>

            {/* Info */}
            <div className="mt-6 p-4 bg-neutral-50 rounded-xl">
              <h3 className="text-body-sm font-medium text-neutral-700 mb-2">তথ্য</h3>
              <dl className="space-y-2 text-body-sm text-neutral-600">
                <div className="flex justify-between">
                  <dt>সদস্য morta</dt>
                  <dd className="font-medium text-neutral-900">{new Date().getFullYear()}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}