import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tuel Animate - Animation Component Library',
  description: 'Premium React animation components with GSAP, Framer Motion, and Three.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold">@tuel/animate</h1>
              </div>
              <div className="flex space-x-8">
                <a href="#components" className="text-gray-700 hover:text-gray-900">
                  Components
                </a>
                <a href="#examples" className="text-gray-700 hover:text-gray-900">
                  Examples
                </a>
                <a href="#migration" className="text-gray-700 hover:text-gray-900">
                  Migration
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}