'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Navbar, Footer } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getInitials } from '@/lib/utils';
import { authClient } from '@/lib/auth-client';

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success('সফলভাবে সাইন আউট হয়েছে!');
      router.push('/');
      router.refresh();
    } catch {
      toast.error('সাইন আউট ব্যর্থ হয়েছে');
    }
  };

  if (isPending) {
    return <main className="container-main py-16 text-center">লোড হচ্ছে…</main>;
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar categories={[]} />
        <main className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="text-center">
            <p className="mb-4 text-body-lg text-neutral-600">আপনি লগইন করা নেই।</p>
            <Link href="/signin"><Button>সাইন ইন করুন</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar categories={[]} />
      <main className="flex-1">
        <div className="container-main py-12">
          <div className="mx-auto max-w-2xl">
            <Card variant="outlined" padding="lg" className="mb-6">
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <div className="flex-shrink-0">
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="h-24 w-24 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-100 text-3xl font-bold text-primary-700">
                      {getInitials(user.name)}
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-heading-xl font-bold text-neutral-900">{user.name}</h1>
                  <p className="mt-1 text-body-md text-neutral-500">{user.email}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-body-sm font-medium text-success">
                    <span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" /> সক্রিয় সদস্য
                  </span>
                </div>
              </div>
            </Card>

            <Card variant="outlined" padding="lg">
              <CardHeader><CardTitle className="text-heading-md">অ্যাকাউন্ট সেটিংস</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Link href="/profile/update">
                  <Button variant="outline" className="w-full justify-start">প্রোফাইল আপডেট করুন</Button>
                </Link>
                <Button variant="danger" className="w-full justify-start" onClick={handleSignOut}>সাইন আউট</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
