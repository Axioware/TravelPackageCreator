import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SafarSaz — Build Your Dream Travel Package',
  description: 'Pakistan\'s most premium travel package builder. Customize every aspect of your trip to Turkey, Dubai, Maldives, Hunza, Hajj, Umrah and more.',
  keywords: 'travel packages Pakistan, Hajj packages, Umrah packages, Turkey tour, Dubai tour, Hunza tour, Skardu tour',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0A1628] text-[#F0F4FF]">{children}</body>
    </html>
  );
}
