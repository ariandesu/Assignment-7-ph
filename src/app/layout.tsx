import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Hind_Siliguri } from 'next/font/google';
import './styles/globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const hindSiliguri = Hind_Siliguri({ subsets: ['latin'], variable: '--font-hind-siliguri', weight: ['300', '400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'বাজার দর - BazarDor | প্রতিদিনের বাজার দাম এক নজরে',
  description: 'বাংলাদেশের সব বাজারের আজকের পণ্যের দাম, দামের পরিবর্তন এবং ট্রেন্ড এক জায়গায়। স্মার্ট কেনাকাটা করুন।',
  keywords: ['বাজার দর', 'পণ্যের দাম', 'বাংলাদেশ বাজার', 'দাম তুলনা', 'কেনাকাটা'],
  authors: [{ name: 'BazarDor Team' }],
  creator: 'BazarDor',
  publisher: 'BazarDor',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    url: 'https://bazardor.com',
    title: 'বাজার দর - BazarDor | প্রতিদিনের বাজার দাম এক নজরে',
    description: 'বাংলাদেশের সব বাজারের আজকের পণ্যের দাম, দামের পরিবর্তন এবং ট্রেন্ড এক জায়গায়।',
    siteName: 'BazarDor',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'বাজার দর - BazarDor',
    description: 'প্রতিদিনের বাজার দাম এক নজরে',
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#171717' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={`${inter.variable} ${hindSiliguri.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-hind antialiased min-h-screen flex flex-col">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#365314',
              color: '#fff',
              borderRadius: '0.75rem',
              padding: '1rem 1.25rem',
              fontFamily: 'var(--font-hind-siliguri), system-ui, sans-serif',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
              style: {
                background: '#dc2626',
              },
            },
          }}
        />
      </body>
    </html>
  );
}