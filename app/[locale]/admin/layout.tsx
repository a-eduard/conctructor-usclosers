"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { 
  ArrowLeft, 
  LayoutGrid, 
  Box, 
  ListTodo, 
  LogOut, 
  Settings,
  Blocks
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const { data: session } = useSession();

  // Define our new navigation structure
  const navItems = [
    { 
      id: "dashboard", 
      name: "Dashboard", 
      href: `/${locale}/admin`, 
      icon: LayoutGrid 
    },
    { 
      id: "marketplace", 
      name: "Marketplace", 
      href: `/${locale}/admin/marketplace`, 
      icon: Box 
    },
    { 
      id: "wizard", 
      name: "Wizard Builder", 
      href: `/${locale}/admin/wizard`, 
      icon: Blocks 
    },
    { 
      id: "orders", 
      name: "Orders", 
      href: `/${locale}/admin/orders`, 
      icon: ListTodo 
    },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] font-sans overflow-hidden selection:bg-indigo-500/30">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-[#111827] border-r border-slate-200 dark:border-slate-800/60 flex flex-col shrink-0 z-10">
        
        {/* Logo & Store Link */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/60">
          <Link
            href={`/${locale}`}
            className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2 mb-6"
          >
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs">F</span>
            </div>
            FOUNDRY
          </Link>
          
          <Link
            href={`/${locale}`}
            className="group flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Storefront
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="p-4 flex-1 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-3">
            Management
          </div>
          
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 mr-3 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-transparent">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
              {session?.user?.name?.charAt(0) || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {session?.user?.name || "Admin User"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {session?.user?.email || "admin@foundry.com"}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
            className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))] -z-10" />
        {children}
      </main>
      
    </div>
  );
}