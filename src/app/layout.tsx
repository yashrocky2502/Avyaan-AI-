import type {Metadata} from 'next';
import Script from 'next/script';
import './globals.css';
import { AppLayout } from '@/components/layout/app-layout';

export const metadata: Metadata = {
  title: 'MarketPulse | Financial Intelligence Terminal',
  description: 'Institutional-grade financial news synthesis and market intelligence.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary/30 overflow-hidden" suppressHydrationWarning>
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
