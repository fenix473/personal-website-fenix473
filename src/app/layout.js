import { Geist, Geist_Mono, Roboto } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import "@/styles/Nav.css";
import "@/styles/Home.css";
import "@/styles/Resume.css";
import "@/styles/Writings.css";
import { Provider } from "@/components/ui/provider";
import ChatWindowWrapper from "@/components/chat/ChatWindowWrapper";
import OrbitBackground from "@/components/layout/OrbitBackground";
import NavAuth from "@/components/layout/NavAuth";

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
  title: "Libero Favi - Portfolio",
  description: "Journalist and Software Engineer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable}`}>
        <Provider>
          <OrbitBackground />
          <div className="App">
            <div className="wip-banner">
              🚧 Work in Progress 🚧
            </div>
            <nav className="navbar">
              <Link href="/">Home</Link>
              <NavAuth />
            </nav>
            {children}
          </div>
          <ChatWindowWrapper />
        </Provider>
      </body>
    </html>
  );
}
