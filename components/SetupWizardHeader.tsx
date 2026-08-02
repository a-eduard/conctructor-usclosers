"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

export function SetupWizardHeader({ showBackButton = false }: { showBackButton?: boolean }) {
  // next-intl automatically knows the current language
  const locale = useLocale();
  const langPrefix = `/${locale}`;

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 shrink-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Replaced manual navigate with Next.js Link and fixed image path */}
          <Link href={langPrefix || "/"}>
            <img
              src="/usc_logo_s.png"
              alt="USClosers Logo"
              className="h-8 hover:opacity-80 transition-opacity cursor-pointer"
            />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {showBackButton && (
            <Link
              href={langPrefix || "/"}
              className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors mr-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Storefront
            </Link>
          )}
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}