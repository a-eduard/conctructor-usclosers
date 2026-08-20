import type { Metadata } from "next";
import { Inter } from "next/font/google";
// @ts-ignore
import "./globals.css";
import { Header } from "../src/components/Header";
import { Footer } from "../src/components/Footer";
import { CalendlyProvider } from "../src/components/CalendlyModal";
import { CookieBanner } from "../src/components/CookieBanner";
import Script from "next/script";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "USClosers | B2B Sales Ecosystem",
  description: "Build a scalable B2B sales ecosystem with our fractional experts and preconfigured infrastructure.",
  icons: {
    icon: '/images/usc_logo_s.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable}`}>
      <body className="font-sans transition-theme antialiased min-h-screen flex flex-col">
        
        {/* Optimized Google Tag Manager Script */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-XXXXXXX');
          `}
        </Script>

        <CalendlyProvider>
          <Header />
          
          <main className="flex-1 flex flex-col relative w-full">
            {children}
          </main>

          <Footer />
        </CalendlyProvider>

        {/* Global UI Overlays */}
        <CookieBanner />

        {/* GTM Fallback for users with disabled JS */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      </body>
    </html>
  );
}