"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Box, Plus, Edit2, Trash2, Image as ImageIcon, Settings } from "lucide-react";
import { Modal } from "./Modal";

type Solution = {
  id: string;
  icon: string;
  name: string;
  concept: string;
  price: string;
  sla: string;
  color: string;
  imageUrl: string | null;
  step1Data: string | null;
  step5Data: string | null;
  clientProvided: string | null;
  cartItems: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export function SolutionManager({ initialSolutions }: { initialSolutions: Solution[] }) {
  const router = useRouter();
  const locale = useLocale();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<Solution>({
    id: "", icon: "target", name: "", concept: "", price: "", sla: "", color: "from-blue-500 to-indigo-600", imageUrl: "",
    step1Data: "", step5Data: "", clientProvided: "", cartItems: ""
  });

  const openAddModal = () => {
    setFormData({
      id: "", icon: "target", name: "", concept: "", price: "", sla: "", color: "from-blue-500 to-indigo-600", imageUrl: "",
      step1Data: "{}", step5Data: "{}", clientProvided: "[]", cartItems: "[]"
    });
    setIsModalOpen(true);
  };

  const openEditModal = (solution: Solution) => {
    setFormData({
      id: solution.id,
      icon: solution.icon || "",
      name: solution.name || "",
      concept: solution.concept || "",
      price: solution.price || "",
      sla: solution.sla || "",
      color: solution.color || "from-blue-500 to-indigo-600",
      imageUrl: solution.imageUrl || "",
      step1Data: solution.step1Data || "{}",
      step5Data: solution.step5Data || "{}",
      clientProvided: solution.clientProvided || "[]",
      cartItems: solution.cartItems || "[]"
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const method = formData.id ? "PUT" : "POST";
    
    const payload = { ...formData };
    if (!payload.id) delete (payload as any).id;
    delete payload.createdAt;
    delete payload.updatedAt;

    try {
      const response = await fetch("/api/solutions", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to save solution");
      
      setIsModalOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to save solution.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this solution?")) return;
    setIsLoading(true);
    try {
      await fetch("/api/solutions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete solution.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Box className="w-8 h-8 text-indigo-600" />
            Marketplace
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Manage your business scale packages and their default wizard configurations.
          </p>
        </div>
        <button onClick={openAddModal} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center transition-colors shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Solution
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialSolutions.map((solution) => (
          <div key={solution.id} className="relative bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
            
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded p-1 shadow-sm border border-slate-100 dark:border-slate-700 z-10">
              <button onClick={() => openEditModal(solution)} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(solution.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 dark:hover:bg-red-900/30"><Trash2 className="w-4 h-4" /></button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 overflow-hidden bg-gradient-to-br ${solution.color || 'from-indigo-500 to-purple-600'}`}>
                {solution.imageUrl ? (
                  <img src={solution.imageUrl} alt={solution.name} className="w-full h-full object-cover" />
                ) : (
                  <Box className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white transition-colors pr-10">
                  {solution.name}
                </h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                  {solution.price} • {solution.sla}
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
              {solution.concept}
            </p>
          </div>
        ))}

        {initialSolutions.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            No solutions found. Click "Add Solution" to create one.
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? "Edit Solution" : "Add New Solution"} maxWidth="2xl">
        <form onSubmit={handleSave} className="space-y-6">
          
          <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">1. Display Settings</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Solution Name</label>
                <input type="text" required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. LinkedIn Outreach" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Estimated Price</label>
                <input type="text" required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="e.g. $2,700" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">SLA (Timeline)</label>
                <input type="text" required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900" value={formData.sla} onChange={(e) => setFormData({ ...formData, sla: e.target.value })} placeholder="e.g. 14 Days" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Color Theme (Tailwind Class)</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} placeholder="e.g. from-blue-500 to-indigo-600" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cover Image URL</label>
              <input type="text" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900" value={formData.imageUrl || ""} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="/solutions/linkedin.png" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Concept / Description</label>
              <textarea rows={3} required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900 custom-scrollbar" value={formData.concept} onChange={(e) => setFormData({ ...formData, concept: e.target.value })} placeholder="Short description of what this solution does..." />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
              <Settings className="w-4 h-4 text-indigo-500" />
              2. Wizard Configuration
            </h3>
            
            {formData.id ? (
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  Use the Visual Builder to click through the wizard and assign exact steps, hires, and services for this solution.
                </p>
                <button
                  type="button"
                  onClick={() => router.push(`/${locale}/admin/marketplace/builder/${formData.id}`)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 font-bold text-sm rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-500/30 transition-colors shadow-sm"
                >
                  <Settings className="w-4 h-4" />
                  Open Visual Builder
                </button>
              </div>
            ) : (
              <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-5 border border-amber-200 dark:border-amber-500/30 text-sm text-amber-800 dark:text-amber-200 text-center shadow-inner">
                Please save this solution first. Once saved, you can open the Visual Builder to configure it.
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50 transition-colors shadow-sm">{isLoading ? "Saving..." : formData.id ? "Update Info" : "Create Solution"}</button>
          </div>
        </form>
      </Modal>

    </div>
  );
}