import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Sanjivani AI Hub — AI Innovation & Research Ecosystem",
    template: "%s | Sanjivani AI Hub",
  },
  description:
    "Sanjivani AI Hub is Sanjivani University's official AI innovation and research ecosystem where students, researchers, and faculty collaborate on artificial intelligence projects, workshops, and technology development.",
  keywords: [
    "Sanjivani University",
    "AI Hub",
    "Artificial Intelligence",
    "Machine Learning",
    "Research",
    "Innovation",
    "Maharashtra",
  ],
  authors: [{ name: "Sanjivani AI Hub" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://sanjivani-aihub.in",
    siteName: "Sanjivani AI Hub",
    title: "Sanjivani AI Hub — AI Innovation & Research Ecosystem",
    description:
      "Building the future with Artificial Intelligence at Sanjivani University.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sanjivani AI Hub",
    description: "AI Innovation & Research Ecosystem at Sanjivani University",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <Navbar />
        <main className="min-h-screen" style={{ paddingTop: "var(--navbar-height)" }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
