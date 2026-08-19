import { Inter } from "next/font/google";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { AuthProvider } from "../../components/AuthProvider";
import { WizardProvider } from "../../contexts/WizardContext";
import "../globals.css";

export const metadata: Metadata = {
  title: "USClosers | B2B Sales Architecture",
  description: "Buy predictable outcomes, not hours. Choose a turnkey solution or build your own custom sales engine.",
  icons: {
    icon: "/usc_logo_s.png",
    apple: "/usc_logo_s.png",
  },
};

// Configure the Inter font for Next.js
const inter = Inter({ 
  subsets: ["latin"], 
  display: "swap",
  variable: "--font-inter",
});

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale || 'en'} className={`light ${inter.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <WizardProvider>
              {children}
            </WizardProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}