import type { Metadata, Viewport } from 'next';
import { Providers } from '@/components/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'ARV Super DApp | Arvand Khabar Token',
  description: 'کیف پول و DApp غیرمتمرکز توکن ARV روی BNB Smart Chain',
  applicationName: 'ARV DApp',
  keywords: ['ARV', 'Arvand Khabar', 'DApp', 'Web3', 'BNB Chain', 'کیف پول'],
  authors: [{ name: 'ساسان اشکش' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
  openGraph: {
    title: 'ARV Super DApp',
    description: 'کیف پول و DApp غیرمتمرکز توکن ARV',
    type: 'website',
    locale: 'fa_IR',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a1929',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
