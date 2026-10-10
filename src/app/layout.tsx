import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'বাজার দর — BazarDor',
  description: 'প্রয়োজনীয় পণ্যের আজকের দাম এক নজরে।',
  keywords: ['বাজার দর', 'বাংলাদেশ বাজার', 'পণ্যের দাম'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FAFCFA',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bn">
      <body className="font-hind min-h-screen bg-neutral-50 text-neutral-900 antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1D271F',
              color: '#fff',
              borderRadius: '0.75rem',
              fontFamily: 'Hind Siliguri, sans-serif',
            },
          }}
        />
      </body>
    </html>
  );
}
