/**
 * Piano project page layout - exports metadata for social sharing (LinkedIn, etc.)
 * Uses static metadata to ensure tags are in initial HTML for crawlers
 * Uses relative paths - metadataBase from root layout converts to absolute URLs
 */
export const metadata = {
  title: 'Piano - Interactive Web Piano | Libero Favi',
  description:
    'Interactive piano with keyboard and touch support. Play melodies, generate AI compositions, and explore music with Web Audio API.',
  openGraph: {
    title: 'Piano - Interactive Web Piano',
    description:
      'Interactive piano with keyboard and touch support. Play melodies, generate AI compositions, and explore music with Web Audio API.',
    url: '/projects/piano',
    siteName: 'Libero Favi Portfolio',
    type: 'website',
    images: [
      {
        url: '/piano-preview.png',
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
    images: ['/piano-preview.png'],
  },
};

export default function PianoLayout({ children }) {
  return children;
}
