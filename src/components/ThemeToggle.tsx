"use client";

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check initial state
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
    
    // Observer for programmatic class changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Prevent hydration mismatch: render an invisible placeholder of the exact same size
  if (!mounted) {
    return <div className={`w-9 h-9 ${className}`} />; 
  }

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-9 h-9 rounded-xl transition-all duration-300 hover:bg-background-surface focus:outline-none flex items-center justify-center overflow-hidden border border-transparent hover:border-border-primary text-text-secondary hover:text-text-primary active:scale-95 ${className}`}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <Sun 
        className={`w-4 h-4 transition-all duration-500 absolute ${isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} 
      />
      <Moon 
        className={`w-4 h-4 transition-all duration-500 absolute ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} 
      />
    </button>
  );
}