/**
 * Piano project page layout - exports metadata for social sharing (LinkedIn, etc.)
 * Uses Next.js Metadata API for server-side rendering - ensures crawlers see meta tags
 */
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

// Construct absolute image URL with proper encoding
const imageUrl = new URL('/Piano Preview.png', baseUrl).toString();

export const metadata = {
  title: 'Piano - Interactive Web Piano | Libero Favi',
  description:
    'Interactive piano with keyboard and touch support. Play melodies, generate AI compositions, and explore music with Web Audio API.',
  openGraph: {
    title: 'Piano - Interactive Web Piano',
    description:
      'Interactive piano with keyboard and touch support. Play melodies, generate AI compositions, and explore music with Web Audio API.',
    url: `${baseUrl}/projects/piano`,
    siteName: 'Libero Favi Portfolio',
    type: 'website',
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 627,
        alt: 'Piano project preview - interactive web piano interface',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Piano - Interactive Web Piano',
    description:
      'Interactive piano with keyboard and touch support. Play melodies, generate AI compositions, and explore music.',
    images: [imageUrl],
  },
};

export default function PianoLayout({ children }) {
  return children;
}
