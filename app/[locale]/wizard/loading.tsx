import React from "react";
import { Target } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-slate-50 dark:bg-[#0B0F19] animate-in fade-in duration-500">
      <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-6 shadow-inner border border-indigo-100 dark:border-indigo-500/20">
        <Target className="w-10 h-10 animate-pulse" />
      </div>
      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
        Loading Architecture...
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
        Connecting to secure database and rendering options
      </p>
    </div>
  );
}