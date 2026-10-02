import type { Metadata, Viewport } from 'next';
import { Providers } from '@/components/Providers';
import { ParticleBackground } from '@/components/ParticleBackground';
import { AppShell } from '@/components/AppShell';
import './globals.css';

export const metadata: Metadata = {
  title: 'Arvand Khabar Token | ARV Super DApp',
  description: 'کیف پول و DApp غیرمتمرکز توکن ARV روی BNB Smart Chain',
  applicationName: 'ARV DApp',
  keywords: [
    'ARV',
    'Arvand Khabar',
    'DApp',
    'Web3',
    'BNB Chain',
    'کیف پول',
    'BEP-20',
    'اروند خبر',
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

  // ===== Open Graph =====
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: 'https://arvtoken.ir',
    siteName: 'ARV DApp',
    title: 'Arvand Khabar Token | ARV Super DApp',
    description: 'کیف پول و DApp غیرمتمرکز توکن ARV روی BNB Smart Chain',
    images: [
      {
        url: '/arv-logo.png',
        width: 1024,
        height: 1024,
        alt: 'ARV Token',
      },
    ],
  },

  // ===== Twitter =====
  twitter: {
    card: 'summary_large_image',
    title: 'Arvand Khabar Token | ARV Super DApp',
    description: 'کیف پول و DApp غیرمتمرکز توکن ARV روی BNB Smart Chain',
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
            <AppShell>{children}</AppShell>
          </Providers>
        </div>
      </body>
    </html>
  );
}
