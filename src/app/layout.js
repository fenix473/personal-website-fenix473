import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "@/styles/design-tokens.css";
import "./globals.css";
import "@/styles/HeaderNav.css";
import "@/styles/Footer.css";
import "@/styles/Home.css";
import "@/styles/Resume.css";
import "@/styles/Writings.css";
import { Provider } from "@/components/ui/provider";
import ChatWindowWrapper from "@/components/chat/ChatWindowWrapper";
import OrbitBackground from "@/components/layout/OrbitBackground";
import Header from "@/components/layout/Header";
import NavAuth from "@/components/layout/NavAuth";
import LayoutIncidentsStats from "@/components/layout/LayoutIncidentsStats";
import { siteMeta, personJsonLd, websiteJsonLd } from "@/data/site-metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${siteMeta.name} - Portfolio`,
    template: `%s | ${siteMeta.name}`,
  },
  description: siteMeta.heroDescription || siteMeta.shortDescription,
  keywords: siteMeta.seo.keywords,
  authors: [{ name: siteMeta.name }],
  creator: siteMeta.name,
  openGraph: {
    type: siteMeta.seo.ogType,
    locale: siteMeta.seo.locale,
    url: siteMeta.seo.ogUrl,
    siteName: siteMeta.seo.ogSiteName,
    title: siteMeta.seo.ogTitle,
    description: siteMeta.seo.ogDescription,
    images: [
      {
        url: siteMeta.seo.ogImage,
        width: 1200,
        height: 630,
        alt: siteMeta.seo.ogSiteName,
      },
    ],
  },
  twitter: {
    card: siteMeta.seo.twitterCard,
    title: siteMeta.seo.twitterTitle,
    description: siteMeta.seo.twitterDescription,
    creator: siteMeta.seo.twitterCreator || undefined,
    images: [siteMeta.seo.twitterImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  themeColor: siteMeta.seo.themeColor,
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  const localeLang = siteMeta.seo.locale ? siteMeta.seo.locale.split("_")[0] : "en";
  return (
    <html lang={localeLang}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable}`}>
        <Provider>
          <OrbitBackground />
          <Header />
          <div className="App">
            {/* <div className="wip-banner">
              🚧 Work in Progress 🚧
            </div> */}
            <main className="App__main">{children}</main>
            <footer className="footer">
              <NavAuth />
            </footer>
          </div>
          <ChatWindowWrapper />
        </Provider>
      </body>
    </html>
  );
}
