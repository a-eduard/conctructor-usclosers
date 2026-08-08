import React from "react";
import { 
  TrendingUp, 
  Users, 
  Box, 
  CreditCard,
  ArrowUpRight
} from "lucide-react";

export default function AdminDashboard() {
  // Mock data for the dashboard UI (we will connect it to Prisma later)
  const stats = [
    { name: "Total Revenue", value: "$45,231.89", change: "+20.1%", icon: CreditCard },
    { name: "Active Orders", value: "12", change: "+3", icon: TrendingUp },
    { name: "Solutions", value: "4", change: "Updated", icon: Box },
    { name: "Vendors", value: "7", change: "Active", icon: Users },
  ];

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Welcome back. Here is what is happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.name} 
              className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">
                  {stat.change}
                  <ArrowUpRight className="w-3 h-3 ml-1" />
                </span>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                  {stat.name}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800/60 rounded-xl bg-slate-50/50 dark:bg-[#0B0F19]/50">
          <p className="text-slate-400 dark:text-slate-500 text-sm">
            Activity feed will be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
}