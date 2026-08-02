import React from "react";
import { ShieldCheck } from "lucide-react";

export function WizardFooter() {
  return (
    <footer className="w-full py-8 mt-16 border-t border-slate-200 dark:border-slate-800/50">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400 dark:text-slate-500">
        
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Secure AES-256 Encrypted Checkout</span>
        </div>

        <div className="flex items-center gap-6 flex-wrap justify-center">
          <a 
            href="https://usclosers.com/en/privacy-policy" 
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            Privacy Policy
          </a>
          <a 
            href="https://usclosers.com/en/terms-of-service" 
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            Terms of Service
          </a>
          <a 
            href="https://usclosers.com/en/cookie-settings" 
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            Cookie Settings
          </a>
        </div>

        <p>© 2026 USClosers Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}