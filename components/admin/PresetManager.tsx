"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Plus, Edit2, Trash2, Settings, Rocket } from "lucide-react";
import { Modal } from "./Modal";

type Preset = {
  id: string;
  segment: string;
  icon: string;
  name: string;
  subtitle: string;
  description: string;
  timeEstimate: string;
  costEstimate: string;
  imageUrl: string | null;
  step1Data: string | null;
  step5Data: string | null;
  clientProvided: string | null;
  cartItems: string | null;
};

export function PresetManager({ initialPresets }: { initialPresets: Preset[] }) {
  const router = useRouter();
  const locale = useLocale();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<Preset>({
    id: "", segment: "SMB", icon: "Rocket", name: "", subtitle: "", description: "", 
    timeEstimate: "", costEstimate: "", imageUrl: "",
    step1Data: "{}", step5Data: "{}", clientProvided: "[]", cartItems: "[]"
  });

  const openAddModal = () => {
    setFormData({
      id: "", segment: "SMB", icon: "Rocket", name: "", subtitle: "", description: "", 
      timeEstimate: "", costEstimate: "", imageUrl: "",
      step1Data: "{}", step5Data: "{}", clientProvided: "[]", cartItems: "[]"
    });
    setIsModalOpen(true);
  };

  const openEditModal = (preset: Preset) => {
    setFormData({ ...preset });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const method = formData.id ? "PUT" : "POST";
    
    const payload = { ...formData };
    if (!payload.id) delete (payload as any).id;

    try {
      const response = await fetch("/api/presets", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to save preset");
      
      setIsModalOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to save preset.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this preset?")) return;
    setIsLoading(true);
    try {
      await fetch("/api/presets", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete preset.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Rocket className="w-8 h-8 text-indigo-600" />
            Onboarding Presets
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Manage the business scale templates shown on Step 0 of the wizard.
          </p>
        </div>
        <button onClick={openAddModal} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center transition-colors shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Preset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialPresets.map((preset) => (
          <div key={preset.id} className="relative bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
            
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded p-1 shadow-sm border border-slate-100 dark:border-slate-700 z-10">
              <button onClick={() => openEditModal(preset)} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(preset.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 dark:hover:bg-red-900/30"><Trash2 className="w-4 h-4" /></button>
            </div>

            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest rounded-full mb-3">
                {preset.segment}
              </span>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1">{preset.name}</h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{preset.subtitle}</p>
            </div>
            <div className="flex gap-4 text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">
               <span>⏱ {preset.timeEstimate}</span>
               <span>💰 {preset.costEstimate}</span>
            </div>
          </div>
        ))}
        {initialPresets.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            No presets found. Click "Add Preset" to create one.
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? "Edit Preset" : "Add New Preset"} maxWidth="2xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">1. Display Settings</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Segment</label>
                <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900" value={formData.segment} onChange={(e) => setFormData({ ...formData, segment: e.target.value })}>
                  <option value="Startups">Startups</option>
                  <option value="SMB">SMB</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Preset Name</label>
                <input type="text" required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time Estimate</label>
                <input type="text" required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900" value={formData.timeEstimate} onChange={(e) => setFormData({ ...formData, timeEstimate: e.target.value })} placeholder="e.g. 14 Days" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cost Estimate</label>
                <input type="text" required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900" value={formData.costEstimate} onChange={(e) => setFormData({ ...formData, costEstimate: e.target.value })} placeholder="e.g. From $4,900" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subtitle</label>
              <input type="text" required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea rows={2} required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Background Image URL</label>
              <input type="text" required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900" value={formData.imageUrl || ""} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
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
                  Open Visual Builder to assign steps and options for this preset.
                </p>
                <button
                  type="button"
                  onClick={() => router.push(`/${locale}/admin/marketplace/builder/preset/${formData.id}`)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 font-bold text-sm rounded-lg hover:bg-indigo-200 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Open Visual Builder
                </button>
              </div>
            ) : (
              <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-5 border text-sm text-amber-800 dark:text-amber-200 text-center">
                Please save this preset first to configure it in Visual Builder.
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50">{isLoading ? "Saving..." : "Save Preset"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}