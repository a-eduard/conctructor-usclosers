"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { MegaMenu, MEGA_MENU_ITEMS } from './MegaMenu';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { USClosersLogo } from './USClosersLogo';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  {
    id: 'salesops',
    title: 'SalesOps',
    items: ['recruiting', 'preconfigured-crm', 'call-recording-qa', 'global-payroll', 'data-scraping', 'predictable']
  },
  {
    id: 'salesforce',
    title: 'Salesforce',
    items: ['scout', 'sdr', 'closer', 'teamlead', 'ai-digital-closer']
  },
  {
    id: 'solutions',
    title: 'Solutions',
    items: ['pricing-linkedin', 'pricing-first-call', 'pricing-mou']
  }
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  // Close mega menu on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMegaMenuOpen) {
        setIsMegaMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMegaMenuOpen]);

  // Close mobile menu on route change & unlock scroll
  useEffect(() => {
    setIsMenuOpen(false);
    document.body.style.overflow = '';
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleMegaMenuEnter = (categoryId?: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    if (categoryId) setActiveCategoryId(categoryId);
    
    hoverTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(true);
    }, 50);
  };

  const handleMegaMenuLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 150);
  };

  const toggleCategory = (catId: string) => {
    setOpenCategory(openCategory === catId ? null : catId);
  };

  return (
    <header className="bg-background-primary border-b border-border-primary sticky top-0 z-50 transition-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <USClosersLogo className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-md transition-theme" />
            <span className="text-lg sm:text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-text-secondary transition-theme">
              USclosers
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <div 
              className="relative h-20 flex items-center px-4"
              onMouseEnter={() => handleMegaMenuEnter('salesops')}
              onMouseLeave={handleMegaMenuLeave}
            >
              <span
                className={`text-[13px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-default transition-all duration-300 ${activeCategoryId === 'salesops' && isMegaMenuOpen ? 'text-blue-600 dark:text-blue-400' : 'text-text-secondary hover:text-text-primary'}`}
              >
                SalesOps
              </span>
            </div>

            <div 
              className="relative h-20 flex items-center px-4"
              onMouseEnter={() => handleMegaMenuEnter('salesforce')}
              onMouseLeave={handleMegaMenuLeave}
            >
              <span
                className={`text-[13px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-default transition-all duration-300 ${activeCategoryId === 'salesforce' && isMegaMenuOpen ? 'text-blue-600 dark:text-blue-400' : 'text-text-secondary hover:text-text-primary'}`}
              >
                Salesforce
              </span>
            </div>

            <div 
              className="relative h-20 flex items-center px-4"
              onMouseEnter={() => handleMegaMenuEnter('solutions')}
              onMouseLeave={handleMegaMenuLeave}
            >
              <span
                className={`text-[13px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-default transition-all duration-300 ${activeCategoryId === 'solutions' && isMegaMenuOpen ? 'text-blue-600 dark:text-blue-400' : 'text-text-secondary hover:text-text-primary'}`}
              >
                Solutions
              </span>
            </div>

            <div className="hidden md:block">
              <MegaMenu 
                isOpen={isMegaMenuOpen} 
                onMouseEnter={() => handleMegaMenuEnter()}
                onMouseLeave={handleMegaMenuLeave}
                activeCategory={activeCategoryId}
              />
            </div>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {/* Desktop language switcher aligns right */}
            <LanguageSwitcher align="right" />
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            aria-label="Toggle Navigation Menu"
            className="md:hidden p-2 text-text-secondary hover:bg-background-surface rounded-lg transition-theme"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6 text-text-primary transition-theme" /> : <Menu className="w-6 h-6 text-text-primary transition-theme" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Animated) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden fixed inset-x-0 top-16 sm:top-20 bottom-0 bg-background-primary z-50 flex flex-col justify-between p-4 sm:p-6 overflow-y-auto border-t border-border-primary transition-theme pb-safe"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-border-primary transition-theme">
                {/* Mobile language switcher forces left alignment */}
                <LanguageSwitcher align="left" />
                <ThemeToggle />
              </div>

              {/* Categorized Accordions for Mobile */}
              <div className="space-y-3 pt-2">
                {CATEGORIES.map((category) => {
                  const isOpen = openCategory === category.id;
                  return (
                    <div key={category.id} className="border border-border-primary rounded-2xl overflow-hidden bg-background-secondary transition-theme">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="w-full flex items-center justify-between p-4 text-left font-black text-base text-text-primary transition-theme"
                      >
                        <span>{category.title}</span>
                        <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="px-3 pb-4 space-y-2 border-t border-border-primary/60 pt-3 bg-background-primary transition-theme"
                          >
                            {category.items.map((itemId) => {
                              const item = MEGA_MENU_ITEMS.find((i) => i.id === itemId);
                              if (!item) return null;
                              return (
                                <Link 
                                  href={item.path} 
                                  key={item.id} 
                                  onClick={() => setIsMenuOpen(false)}
                                  className="flex items-center justify-between p-3 rounded-xl hover:bg-background-surface transition-colors group"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg ${item.bgColor} dark:bg-slate-800/50 flex items-center justify-center transition-theme shrink-0`}>
                                      <item.icon className={`w-4 h-4 ${item.color} transition-theme`} />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <span className="font-bold text-sm text-text-primary transition-theme truncate">{item.title}</span>
                                      <span className="text-[10px] text-text-secondary transition-theme truncate">{item.subtitle}</span>
                                    </div>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0" />
                                </Link>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-border-primary mt-6 mb-8 sm:mb-4 transition-theme">
              <Link 
                href="/setup" 
                onClick={() => setIsMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all"
              >
                Get Started / Setup <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}