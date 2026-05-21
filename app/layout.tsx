import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navigation from '@/components/Navigation';
import ChatBot from '@/components/ChatBot';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'HeatShield AI — Urban Heat Island Intelligence',
  description: 'AI-powered platform to detect, predict, and reduce Urban Heat Islands in cities. Real-time heat maps, smart recommendations, and citizen alerts.',
  keywords: 'urban heat island, climate tech, smart city, AI, heat map, sustainability',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-[#020817] text-slate-200 antialiased`}>
        <Navigation />
        <main>{children}</main>
        <ChatBot />
      </body>
    </html>
  );
}
