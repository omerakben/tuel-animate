import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Tuel Animate - Web Demos',
  description: 'Interactive animation demos showcasing Tuel Animate components',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <main className="relative">{children}</main>
      </body>
    </html>
  );
}
