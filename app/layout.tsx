import type { Metadata, Viewport } from 'next';
import { Providers } from '@/components/Providers';
import { ParticleBackground } from '@/components/ParticleBackground';
import './globals.css';

export const metadata: Metadata = {
  title: 'Arvand Khabar Token | ARV Super DApp',
  description: 'کیف پول و DApp غیرمتمرکز توکن ARV روی BNB Smart Chain',
  applicationName: 'ARV DApp',
  keywords: ['ARV', 'Arvand Khabar', 'DApp', 'Web3', 'BNB Chain', 'کیف پول'],
  authors: [{ name: 'ساسان اشکش' }],
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
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
      <body>
        <ParticleBackground />
        <div className="relative z-10">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
