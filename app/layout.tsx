import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/ui/Navbar';
import ToastContainer from '@/components/ui/ToastContainer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'AirVision Almaty',
  description: 'Smart city air quality monitoring platform for Almaty',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Navbar />
        <main className="pt-14 md:pl-56 min-h-screen">
          <div className="p-4 h-[calc(100vh-56px)] overflow-y-auto">
            {children}
          </div>
        </main>
        <ToastContainer />
      </body>
    </html>
  );
}
