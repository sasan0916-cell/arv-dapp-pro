import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { Providers } from '@/components/Providers';
import ReferralTracker from '@/components/ReferralTracker';
import { ParticleBackground } from '@/components/ParticleBackground';
import { AppShell } from '@/components/AppShell';
import ToastProvider from '@/components/ui/ToastProvider';
import './globals.css';

// 🔥 آدرس فعلی DApp
const SITE_URL = 'https://arv-dapp-v6.sasan0916.workers.dev';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: 'ARV Super DApp | عرضه رسمی و صرافی غیرمتمرکز ARV',
  description: 'مرجع رسمی عرضه توکن ARV، صرافی غیرمتمرکز (DEX) و کیف پول | معامله ARV با سایر توکن‌ها و اتصال به کیف پول‌های خارجی روی BNB Smart Chain',
  applicationName: 'ARV DApp',
  keywords: [
    'ARV',
    'Arvand Khabar',
    'اروند خبر',
    'عرضه رسمی ARV',
    'صرافی غیرمتمرکز',
    'DEX',
    'DApp',
    'Web3',
    'BNB Chain',
    'کیف پول',
    'BEP-20',
    'DeFi',
    'WalletConnect'
  ],
  authors: [{ name: 'ساسان اشکش' }],
  creator: 'Arvand Khabar Team',
  publisher: 'Arvand Khabar',
  manifest: '/manifest.json',

  // ===== آیکون‌ها =====
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { url: '/arv-logo.png', sizes: '1024x1024', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/icon-192.png',
  },

  // ===== iOS PWA =====
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ARV DApp',
    startupImage: ['/icon-512.png'],
  },

  // ===== Open Graph (تلگرام، واتساپ، فیسبوک) =====
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: SITE_URL,
    siteName: 'ARV Super DApp',
    title: 'ARV Super DApp | عرضه رسمی و صرافی غیرمتمرکز ARV',
    description: 'مرجع رسمی عرضه توکن ARV، صرافی غیرمتمرکز (DEX) و کیف پول | معامله ARV با سایر توکن‌ها و اتصال به کیف پول‌های خارجی روی BNB Smart Chain',
    images: [
      {
        url: '/arv-logo.png',
        width: 1024,
        height: 1024,
        alt: 'ARV Token - Arvand Khabar',
      },
    ],
  },

  // ===== Twitter / X =====
  twitter: {
    card: 'summary_large_image',
    site: '@ARV_BSC',
    creator: '@ARV_BSC',
    title: 'ARV Super DApp | عرضه رسمی و صرافی غیرمتمرکز ARV',
    description: 'مرجع رسمی عرضه توکن ARV، صرافی غیرمتمرکز (DEX) و کیف پول | معامله ARV با سایر توکن‌ها و اتصال به کیف پول‌های خارجی روی BNB Smart Chain',
    images: ['/arv-logo.png'],
  },

  // ===== دیگر =====
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },

  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'ARV DApp',
    'application-name': 'ARV DApp',
    'msapplication-TileColor': '#0a1929',
    'msapplication-tap-highlight': 'no',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0a1929' },
    { media: '(prefers-color-scheme: dark)', color: '#0a1929' },
  ],
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a1929" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
      </head>
      <body>
        <ParticleBackground />
        <div className="relative z-10">
          <Providers>
            <Suspense fallback={null}>
              <ReferralTracker />
            </Suspense>
            <AppShell>{children}</AppShell>
          </Providers>
        </div>
        <ToastProvider />
      </body>
    </html>
  );
}
