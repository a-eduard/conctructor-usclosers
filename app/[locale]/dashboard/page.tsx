/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { CreditCard, UploadCloud, CheckCircle, Clock, Search, Activity, Gauge, LayoutDashboard, CheckSquare, BarChart3, Receipt, Settings, Users, LogOut, Menu, X, Bell } from 'lucide-react';
import { ThemeToggle } from '../../../components/ThemeToggle';

type Task = { id: string; orderId: string; status: string; slaDeadline: string; optionName: string; vendorName: string; deliverables: any; };
type Order = { id: string; status: string; totalPrice: string; createdAt: string; };

export default function Dashboard() {
  const [order, setOrder] = useState<Order | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const locale = useLocale();

  const fetchDashboardData = async () => {
    try {
      const orderRes = await fetch('/api/dashboard/latest-order');
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        setOrder(orderData);
        
        const tasksRes = await fetch(`/api/dashboard/tasks?orderId=${orderData.id}`);
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setTasks(tasksData);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handlePayNow = async () => {
    if (!order) return;
    try {
      await fetch('/api/orders/checkout/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id })
      });
      fetchDashboardData();
    } catch (e) {
      console.error(e);
      alert('Payment failed');
    }
  };

  const handleUpload = async (taskId: string) => {
    try {
      await fetch(`/api/dashboard/upload/${taskId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl: 'https://example.com/mock-upload.pdf' })
      });
      fetchDashboardData();
    } catch (e) {
      console.error(e);
      alert('Upload failed');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-500 font-mono">Loading Workspace...</div>;
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 font-sans p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">No active configuration found.</h2>
        <Link href={`/${locale}/wizard`} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-sm">
          Start Guided Setup
        </Link>
      </div>
    );
  }

  const isDraft = order.status === 'DRAFT';

  const actionRequiredTasks = tasks.filter(t => t.status === 'ACTION_REQUIRED' || t.status === 'DRAFT');
  const inProgressTasks = tasks.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS' || t.status === 'PROCESSING');
  const reviewTasks = tasks.filter(t => t.status === 'REVIEW');
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED' || t.status === 'ACTIVE');

  const renderTaskCard = (task: Task) => {
    const isActionRequired = task.status === 'ACTION_REQUIRED';
    return (
      <div key={task.id} className={`bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border ${isActionRequired ? 'border-amber-300 dark:border-amber-700/50 bg-amber-50/30 dark:bg-amber-900/10' : 'border-slate-200 dark:border-slate-700'} mb-3 transition-all group`}>
        <div className="flex justify-between items-start mb-2">
          <p className="font-semibold text-sm text-slate-900 dark:text-white leading-snug pr-2">{task.optionName}</p>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${isActionRequired ? 'bg-amber-100 text-amber-700' : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'}`}>
            {task.status.replace('_', ' ')}
          </span>
        </div>
        
        <div className="flex flex-col gap-2 mt-3">
          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="w-16">Assigned:</span>
            <span className="text-slate-700 dark:text-slate-300">{task.vendorName}</span>
          </div>
          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="w-16">SLA:</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {task.slaDeadline ? new Date(task.slaDeadline).toLocaleDateString() : 'Pending'}</span>
          </div>
        </div>

        {isActionRequired && !isDraft && (
          <div className="mt-4 pt-3 border-t border-amber-200 dark:border-amber-800/50">
            <button 
              onClick={() => handleUpload(task.id)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-amber-300 hover:text-amber-700 dark:hover:text-amber-400 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 shadow-sm transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              Upload Asset
            </button>
          </div>
        )}
      </div>
    );
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks & Deliverables', icon: CheckSquare },
    { id: 'reports', label: 'Analytics', icon: BarChart3 },
    { id: 'billing', label: 'Billing & Invoices', icon: Receipt },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex flex-col md:flex-row">
      <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img src="/usc_logo_s.png" alt="USClosers Logo" className="h-6" />
          <span className="font-extrabold tracking-widest text-slate-500 uppercase text-sm">Client Portal</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 p-2">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <aside className={`
        fixed md:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 hidden md:flex items-center gap-3 mb-4">
          <img src="/usc_logo_s.png" alt="USClosers Logo" className="h-8" />
        </div>
        
        <div className="px-4 py-2">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-2">Workspace</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4 px-2">
            <ThemeToggle />
            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
          </div>
          <Link href={`/${locale}`} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors">
            <LogOut className="w-5 h-5 text-slate-400 dark:text-slate-500" />
            Exit Portal
          </Link>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        {isDraft && activeTab === 'dashboard' && (
          <div className="bg-indigo-600 text-white px-6 py-4 z-20 shadow-md shrink-0">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-bold text-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-indigo-300" />
                  Your Custom Sales Engine is ready.
                </p>
                <p className="text-indigo-200 text-sm">Activate to start deployment and unblock vendor tasks.</p>
              </div>
              <button 
                onClick={handlePayNow}
                className="px-6 py-2.5 bg-white text-indigo-600 hover:bg-indigo-50 font-bold rounded-xl shadow-sm transition-colors whitespace-nowrap flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Pay Now (${Number(order.totalPrice).toLocaleString()})
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            
            {activeTab === 'dashboard' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Track deliverables, upload required assets, and monitor SLAs.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Platform Uptime</p>
                      <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white">99.99%</p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Gauge className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Speed to Lead</p>
                      <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white">4m 30s</p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <Search className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Lead to SQL</p>
                      <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white">12.4%</p>
                    </div>
                  </div>
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 transition-opacity duration-300 ${isDraft ? 'opacity-50 pointer-events-none filter grayscale-[30%]' : ''}`}>
                  <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-4 flex flex-col max-h-[800px]">
                    <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex justify-between items-center px-1">
                      Action Required
                      <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 rounded-full text-xs py-0.5 font-mono">{actionRequiredTasks.length}</span>
                    </h3>
                    <div className="overflow-y-auto pr-2 pb-4 space-y-3 flex-1 custom-scrollbar">
                      {actionRequiredTasks.length === 0 ? (
                         <div className="text-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-400 text-sm">No action required</div>
                      ) : actionRequiredTasks.map(renderTaskCard)}
                    </div>
                  </div>

                  <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-4 flex flex-col max-h-[800px]">
                    <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex justify-between items-center px-1">
                      In Progress
                      <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 rounded-full text-xs py-0.5 font-mono">{inProgressTasks.length}</span>
                    </h3>
                    <div className="overflow-y-auto pr-2 pb-4 space-y-3 flex-1 custom-scrollbar">
                      {inProgressTasks.length === 0 ? (
                         <div className="text-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-400 text-sm">Empty</div>
                      ) : inProgressTasks.map(renderTaskCard)}
                    </div>
                  </div>

                  <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-4 flex flex-col max-h-[800px]">
                    <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex justify-between items-center px-1">
                      Review
                      <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 rounded-full text-xs py-0.5 font-mono">{reviewTasks.length}</span>
                    </h3>
                    <div className="overflow-y-auto pr-2 pb-4 space-y-3 flex-1 custom-scrollbar">
                       {reviewTasks.length === 0 ? (
                         <div className="text-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-400 text-sm">Empty</div>
                      ) : reviewTasks.map(renderTaskCard)}
                    </div>
                  </div>

                  <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-4 flex flex-col max-h-[800px]">
                    <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex justify-between items-center px-1">
                      Completed
                      <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 rounded-full text-xs py-0.5 font-mono">{completedTasks.length}</span>
                    </h3>
                    <div className="overflow-y-auto pr-2 pb-4 space-y-3 flex-1 custom-scrollbar">
                       {completedTasks.length === 0 ? (
                         <div className="text-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-400 text-sm">Empty</div>
                      ) : completedTasks.map(renderTaskCard)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">Tasks & Deliverables</h1>
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                          <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Service</th>
                          <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vendor</th>
                          <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">SLA Deadline</th>
                          <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {tasks.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-500">No tasks found.</td>
                          </tr>
                        ) : tasks.map(task => (
                          <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <td className="p-4">
                              <p className="font-semibold text-slate-900 dark:text-white">{task.optionName}</p>
                            </td>
                            <td className="p-4 text-slate-600 dark:text-slate-300">{task.vendorName}</td>
                            <td className="p-4">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                                {task.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="p-4 text-slate-600 dark:text-slate-300">
                              {task.slaDeadline ? new Date(task.slaDeadline).toLocaleDateString() : '-'}
                            </td>
                            <td className="p-4 text-right">
                              {task.status === 'ACTION_REQUIRED' && !isDraft ? (
                                <button onClick={() => handleUpload(task.id)} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-semibold">
                                  Upload
                                </button>
                              ) : (
                                <span className="text-slate-400 text-sm">View</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-20">
                <BarChart3 className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Analytics Dashboard</h2>
                <p className="text-slate-500 dark:text-slate-400">Detailed reporting and metrics will appear here once your pipeline is active.</p>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-20">
                <Receipt className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Billing & Invoices</h2>
                <p className="text-slate-500 dark:text-slate-400">Manage your subscription and view past invoices.</p>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-20">
                <Users className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Team Management</h2>
                <p className="text-slate-500 dark:text-slate-400">Invite team members and manage permissions.</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-20">
                <Settings className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Workspace Settings</h2>
                <p className="text-slate-500 dark:text-slate-400">Configure your company profile and preferences.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}