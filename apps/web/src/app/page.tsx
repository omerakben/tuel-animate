import Link from 'next/link';

export default function HomePage() {
  const demos = [
    {
      href: '/karim-saab-scroll',
      title: 'Karim Saab Scroll',
      description: 'Interactive scroll animation demo',
    },
    {
      href: '/mat-voyce-scroll',
      title: 'Mat Voyce Scroll',
      description: 'Advanced scroll-triggered animations',
    },
    {
      href: '/nvg8-scroll',
      title: 'NVG8 Scroll',
      description: 'Modern scroll interaction patterns',
    },
    {
      href: '/orchestra-cubes',
      title: 'Orchestra Cubes',
      description: '3D cube animations and interactions',
    },
    {
      href: '/telescope-image-scroll',
      title: 'Telescope Image Scroll',
      description: 'Image-based scroll animations',
    },
    {
      href: '/telescope-scroll',
      title: 'Telescope Scroll',
      description: 'Telescope-inspired scroll effects',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Tuel Animate Web Demos</h1>
          <p className="text-lg text-muted-foreground">
            Interactive animation demos showcasing the power of Tuel Animate components
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demos.map((demo) => (
            <Link
              key={demo.href}
              href={demo.href}
              className="group block p-6 border rounded-lg hover:shadow-lg transition-all duration-200 hover:border-primary"
            >
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {demo.title}
              </h3>
              <p className="text-muted-foreground">{demo.description}</p>
            </Link>
          ))}
        </div>

        <footer className="text-center mt-16 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            Built with Tuel Animate • Next.js 15 • React 19
          </p>
        </footer>
      </div>
    </div>
  );
}
