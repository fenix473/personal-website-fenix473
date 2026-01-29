import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import "@/styles/Nav.css";
import "@/styles/Home.css";
import "@/styles/Resume.css";
import "@/styles/Writings.css";
import { Provider } from "@/components/ui/provider";
import ChatWindow from "@/components/ChatWindow";
import OrbitBackground from "@/components/OrbitBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Provider>
          <OrbitBackground />
          <div className="App">
            <div className="wip-banner">
              🚧 Work in Progress 🚧
            </div>
            <nav className="navbar">
              <Link href="/">Home</Link>
              <Link href="/projects">Projects</Link>
              <Link href="/writings">Writings</Link>
              <Link href="/orbit">Orbit</Link>
            </nav>
            {children}
          </div>
          <ChatWindow />
        </Provider>
      </body>
    </html>
  );
}
