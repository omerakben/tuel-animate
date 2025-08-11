export async function GET(
  request: Request,
  { params }: { params: Promise<{ dimensions: string[] }> }
) {
  try {
    const { dimensions } = await params;
    const url = new URL(request.url);

    // Get dimensions from path
    const [width = '400', height = '300'] = dimensions || [];
    const w = parseInt(width, 10) || 400;
    const h = parseInt(height, 10) || 300;

    // Get seed from query params for color variation
    const seed = parseInt(url.searchParams.get('seed') || '1');

    // Generate colors based on seed
    const hue = (seed * 137.508) % 360; // Golden angle for better color distribution
    const saturation = 50 + (seed % 30); // 50-80%
    const lightness = 60 + (seed % 20); // 60-80%

    const color1 = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    const color2 = `hsl(${(hue + 60) % 360}, ${saturation}%, ${lightness - 10}%)`;

    const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
      <text x="50%" y="50%" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="${Math.min(w, h) / 8}" fill="white" fill-opacity="0.8">${w}×${h}</text>
    </svg>`;

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('Error generating placeholder:', error);
    return new Response('Error generating placeholder', { status: 500 });
  }
}
