
"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface HeaderProps {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  isSticky?: boolean;
  className?: string;
}

export function Header({ 
  leftContent, 
  rightContent, 
  isSticky = true, 
  className = "" 
}: HeaderProps) {
  const locale = useLocale();

  return (
    <nav 
      className={`w-full bg-white dark:bg-[#0B0F19] px-6 py-4 border-b border-slate-200 dark:border-slate-800 ${
        isSticky ? "sticky top-0 z-50" : "relative z-50"
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        
        {/* Left Side: Logo + Page Specific Content */}
        <div className="flex items-center gap-6 md:gap-10">
          <Link href={`/${locale}`}>
            <img
              src="/usc_logo_s.png"
              alt="USClosers Logo"
              className="h-8 hover:opacity-80 transition-opacity cursor-pointer shrink-0"
            />
          </Link>
          {leftContent}
        </div>
        
        {/* Right Side: Page Specific Content + Controls */}
        <div className="flex items-center gap-4">
          {rightContent}
          <div className="hidden md:block w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
        
      </div>
    </nav>
  );
}