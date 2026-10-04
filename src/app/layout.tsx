import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider, ThemeScript } from "@/hooks/useTheme";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartSyncProvider } from "@/components/cart/CartSyncProvider";
import { STORE_NAME, STORE_DESCRIPTION } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: `${STORE_NAME} — Minimalist Goods & Everyday Carry`,
    template: `%s | ${STORE_NAME}`,
  },
  description: STORE_DESCRIPTION,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: `${STORE_NAME} — Minimalist Goods`,
    description: STORE_DESCRIPTION,
    siteName: STORE_NAME,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <ThemeScript />
      </head>
      <body className="flex flex-col min-h-screen bg-canvas text-text-primary antialiased">
        <ThemeProvider>
          <CartSyncProvider />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </ThemeProvider>
      </body>
    </html>
  );
}
