import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chic Jeune - شيك جون",
  description: "أناقة تليق بكِ - متجر الملابس العصرية في فاس",
  openGraph: {
    title: "Chic Jeune - شيك جون",
    description: "أناقة تليق بكِ - متجر الملابس العصرية في فاس",
    siteName: "Chic Jeune",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
