import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import MainContent from "@/components/layout/MainContent";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/ui/BackToTop";
import FloatingContactButtons from "@/components/chatbot/FloatingContactButtons";
import { site } from "@/lib/content";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Pumpsquare Systems LLP — Industrial Pump Manufacturer, Gujarat, India",
    template: "%s | Pumpsquare Systems LLP",
  },
  description: site.description,
  keywords: [
    "industrial pumps",
    "progressive cavity pumps",
    "twin screw pumps",
    "triple screw pumps",
    "gear pumps",
    "lobe pumps",
    "pump manufacturer Gujarat",
    "Pumpsquare Systems LLP",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.name,
    title: "Pumpsquare Systems LLP — Pumping and Solutions",
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <BackToTop />
        <FloatingContactButtons />
      </body>
    </html>
  );
}
