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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
