import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import "./css/Nav.css";
import "./css/Home.css";
import "./css/Resume.css";
import "./css/Writings.css";
import { Provider } from "@/components/ui/provider";
import ChatWindow from "./components/ChatWindow";

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
          <div className="App">
            <div className="wip-banner">
              🚧 Work in Progress 🚧
            </div>
            <nav className="navbar">
              <Link href="/">Home</Link>
              <Link href="/projects">Projects</Link>
              <Link href="/writings">Writings</Link>
            </nav>
            {children}
          </div>
          <ChatWindow />
        </Provider>
      </body>
    </html>
  );
}
