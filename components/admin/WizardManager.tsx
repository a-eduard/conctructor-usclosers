"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Blocks, Plus, Edit2, Trash2, LayoutTemplate, Image as ImageIcon, ChevronDown, ChevronRight, X } from "lucide-react";
import { Modal } from "./Modal";

type WizardOption = {
  id: string;
  name: string;
  type: string;
  price: number;
  imageUrl?: string | null;
  detailsTitle?: string | null;
  bullets?: string | null;
  grades?: string | null;
};

type WizardBlock = {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  order: number;
  options: WizardOption[];
};

type WizardStep = {
  id: string;
  stepNumber: number;
  title: string;
  description: string | null;
  blocks: WizardBlock[];
};

const AVAILABLE_ICONS = [
  { id: 'calendar', name: '🗓️ Calendar' },
  { id: 'bot', name: '🤖 AI Bot' },
  { id: 'video', name: '🎥 Video Meeting' },
  { id: 'users', name: '👥 Users / CRM' },
  { id: 'zap', name: '⚡ Lightning / Action' },
  { id: 'briefcase', name: '💼 Briefcase / Invoice' },
  { id: 'phone', name: '📞 Phone Call' },
  { id: 'message', name: '💬 Message / Chat' },
  { id: 'settings', name: '⚙️ Settings / Setup' }
];

export function WizardManager({ initialSteps }: { initialSteps: WizardStep[] }) {
  const router = useRouter();
  
  // --- ACCORDION STATE ---
  const [expandedStepId, setExpandedStepId] = useState<string | null>(initialSteps.length > 0 ? initialSteps[0].id : null);

  // --- STATE FOR MODALS ---
  const [isStepModalOpen, setIsStepModalOpen] = useState(false);
  const [stepFormData, setStepFormData] = useState({ id: "", stepNumber: "", title: "", description: "" });
  
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [blockFormData, setBlockFormData] = useState({ id: "", name: "", description: "", imageUrl: "", order: "" });

  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  
  const [optionFormData, setOptionFormData] = useState<{
    id: string; name: string; type: string; price: string; imageUrl: string; detailsTitle: string; bullets: string; grades: string;
  }>({ id: "", name: "", type: "service", price: "0", imageUrl: "", detailsTitle: "", bullets: "", grades: "" });

  const [isLoading, setIsLoading] = useState(false);

  const toggleStep = (stepId: string) => {
    setExpandedStepId(prev => prev === stepId ? null : stepId);
  };

  // --- DYNAMIC DATA PARSERS (For Visual Builders) ---
  const templateData = useMemo(() => {
    try {
      const parsed = JSON.parse(optionFormData.grades || "{}");
      return {
        flow: Array.isArray(parsed.flow) ? parsed.flow : [],
        service: parsed.service || { price: 0, sla: "5 Days" },
        hire: parsed.hire || { price: 0, sla: "10 Days" }
      };
    } catch (e) {
      return { flow: [], service: { price: 0, sla: "5 Days" }, hire: { price: 0, sla: "10 Days" } };
    }
  }, [optionFormData.grades]);

  const hireGradesData = useMemo(() => {
    try {
      const parsed = JSON.parse(optionFormData.grades || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }, [optionFormData.grades]);

  // --- DYNAMIC DATA HANDLERS ---
  const handleAddFunnelStep = () => {
    const data = { ...templateData };
    data.flow.push({ label: "New Step", icon: "calendar" });
    setOptionFormData({ ...optionFormData, grades: JSON.stringify(data) });
  };

  const handleFunnelStepChange = (index: number, field: string, value: string) => {
    const data = { ...templateData };
    data.flow[index][field] = value;
    setOptionFormData({ ...optionFormData, grades: JSON.stringify(data) });
  };

  const handleRemoveFunnelStep = (index: number) => {
    const data = { ...templateData };
    data.flow.splice(index, 1);
    setOptionFormData({ ...optionFormData, grades: JSON.stringify(data) });
  };

  const handleTemplatePricingChange = (type: 'service' | 'hire', field: string, value: any) => {
    const data = { ...templateData };
    if (!data[type]) data[type] = { price: 0, sla: "" };
    data[type][field] = field === 'price' ? Number(value) || 0 : value;
    setOptionFormData({ ...optionFormData, grades: JSON.stringify(data) });
  };

  const handleAddHireGrade = () => {
    const data = [...hireGradesData];
    data.push({ level: "new_level", label: "New Level", price: 0, sla: "14 Days" });
    setOptionFormData({ ...optionFormData, grades: JSON.stringify(data) });
  };

  const handleHireGradeChange = (index: number, field: string, value: any) => {
    const data = [...hireGradesData];
    if (field === 'price') {
      data[index].price = Number(value) || 0;
    } else {
      data[index][field] = value;
      if (field === 'label') {
        data[index].level = (value as string).toLowerCase().replace(/[^a-z0-9]/g, '_');
      }
    }
    setOptionFormData({ ...optionFormData, grades: JSON.stringify(data) });
  };

  const handleRemoveHireGrade = (index: number) => {
    const data = [...hireGradesData];
    data.splice(index, 1);
    setOptionFormData({ ...optionFormData, grades: JSON.stringify(data) });
  };

  // --- SAVE HANDLERS ---
  const handleSaveStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const method = stepFormData.id ? "PUT" : "POST";
    try {
      const response = await fetch("/api/wizard-steps", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stepFormData),
      });
      if (!response.ok) throw new Error("Failed to save step");
      setIsStepModalOpen(false);
      setStepFormData({ id: "", stepNumber: "", title: "", description: "" });
      router.refresh(); 
    } catch (error) {
      console.error(error);
      alert("Failed to save step.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStepId && !blockFormData.id) return;
    setIsLoading(true);
    const method = blockFormData.id ? "PUT" : "POST";
    try {
      const response = await fetch("/api/wizard-blocks", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...blockFormData, stepId: activeStepId }),
      });
      if (!response.ok) throw new Error("Failed to save block");
      setIsBlockModalOpen(false);
      setBlockFormData({ id: "", name: "", description: "", imageUrl: "", order: "" });
      setActiveStepId(null);
      router.refresh(); 
    } catch (error) {
      console.error(error);
      alert("Failed to save block.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBlockId && !optionFormData.id) return;
    setIsLoading(true);
    const method = optionFormData.id ? "PUT" : "POST";
    
    const payload = {
      ...optionFormData,
      blockId: activeBlockId,
      grades: optionFormData.grades.trim() !== "" ? optionFormData.grades.trim() : null
    };

    try {
      const response = await fetch("/api/wizard-options", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to save option");
      setIsOptionModalOpen(false);
      setOptionFormData({ id: "", name: "", type: "service", price: "0", imageUrl: "", detailsTitle: "", bullets: "", grades: "" });
      setActiveBlockId(null);
      router.refresh(); 
    } catch (error) {
      console.error(error);
      alert("Failed to save option.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- DELETE HANDLERS ---
  const handleDeleteStep = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this step? This will remove all its blocks and options.")) return;
    setIsLoading(true);
    try {
      await fetch("/api/wizard-steps", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      router.refresh();
    } catch (e) { console.error(e); alert("Failed to delete step."); }
    finally { setIsLoading(false); }
  };

  const handleDeleteBlock = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this block? This will remove all its options.")) return;
    setIsLoading(true);
    try {
      await fetch("/api/wizard-blocks", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      router.refresh();
    } catch (e) { console.error(e); alert("Failed to delete block."); }
    finally { setIsLoading(false); }
  };

  const handleDeleteOption = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this option?")) return;
    setIsLoading(true);
    try {
      await fetch("/api/wizard-options", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      router.refresh();
    } catch (e) { console.error(e); alert("Failed to delete option."); }
    finally { setIsLoading(false); }
  };

  // --- OPEN MODAL HANDLERS ---
  const openAddStepModal = () => {
    setStepFormData({ id: "", stepNumber: "", title: "", description: "" });
    setIsStepModalOpen(true);
  };
  const openEditStepModal = (step: WizardStep) => {
    setStepFormData({ id: step.id, stepNumber: step.stepNumber.toString(), title: step.title, description: step.description || "" });
    setIsStepModalOpen(true);
  };

  const openAddBlockModal = (stepId: string) => {
    setActiveStepId(stepId);
    setBlockFormData({ id: "", name: "", description: "", imageUrl: "", order: "" });
    setIsBlockModalOpen(true);
  };
  const openEditBlockModal = (block: WizardBlock) => {
    setBlockFormData({ id: block.id, name: block.name, description: block.description || "", imageUrl: block.imageUrl || "", order: block.order.toString() });
    setIsBlockModalOpen(true);
  };

  const openAddOptionModal = (blockId: string) => {
    setActiveBlockId(blockId);
    setOptionFormData({ id: "", name: "", type: "service", price: "0", imageUrl: "", detailsTitle: "", bullets: "", grades: "" });
    setIsOptionModalOpen(true);
  };
  
  const openEditOptionModal = (option: WizardOption) => {
    let formattedBullets = option.bullets || "";
    if (formattedBullets.startsWith('[')) {
      try {
        const parsed = JSON.parse(formattedBullets);
        formattedBullets = Array.isArray(parsed) ? parsed.join('\n') : formattedBullets;
      } catch(e) {}
    }

    setOptionFormData({ 
      id: option.id, 
      name: option.name, 
      type: option.type, 
      price: option.price.toString(), 
      imageUrl: option.imageUrl || "", 
      detailsTitle: option.detailsTitle || "",
      bullets: formattedBullets,
      grades: option.grades || ""
    });
    setIsOptionModalOpen(true);
  };

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Blocks className="w-8 h-8 text-indigo-600" />
            Wizard Builder
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Configure the steps, blocks, and options for your dynamic sales wizard.
          </p>
        </div>
        <button onClick={openAddStepModal} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center transition-colors shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Step
        </button>
      </div>

      <div className="space-y-6">
        {initialSteps.map((step) => {
          const isExpanded = expandedStepId === step.id;

          return (
            <div key={step.id} className={`bg-white dark:bg-[#111827] border ${isExpanded ? 'border-indigo-200 dark:border-indigo-900/50 shadow-md' : 'border-slate-200 dark:border-slate-800/60 shadow-sm'} rounded-2xl overflow-hidden transition-all duration-200`}>
              
              <div 
                onClick={() => toggleStep(step.id)}
                className={`group flex justify-between items-center p-4 cursor-pointer transition-colors ${isExpanded ? 'bg-indigo-50/50 dark:bg-indigo-500/5 border-b border-indigo-100 dark:border-indigo-900/50' : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border-b border-slate-200 dark:border-slate-800/60'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-md transition-colors ${isExpanded ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-slate-300 dark:group-hover:bg-slate-600'}`}>
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Step {step.stepNumber}</span>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{step.title}</h2>
                  </div>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => openAddBlockModal(step.id)} className="mr-4 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-md transition-colors">
                    <Plus className="w-3 h-3 mr-1" /> Add Block
                  </button>
                  <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mr-2"></div>
                  <button onClick={() => openEditStepModal(step)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDeleteStep(step.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              
              {isExpanded && (
                <div className="p-6 bg-white dark:bg-[#0B0F19]">
                  {step.blocks.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center">
                      <LayoutTemplate className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
                      <p>No blocks added to this step yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {step.blocks.map((block) => (
                        <div key={block.id} className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 bg-slate-50/30 dark:bg-slate-900/30">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                              <LayoutTemplate className="w-4 h-4 text-slate-400 mr-2" />
                              <h3 className="font-semibold text-slate-900 dark:text-white mr-3">{block.name}</h3>
                              {block.imageUrl && (
                                <span title="Has Image" className="flex items-center">
                                  <ImageIcon className="w-4 h-4 text-indigo-400" />
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => openAddOptionModal(block.id)} className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center">
                                <Plus className="w-3 h-3 mr-1" /> Add Option
                              </button>
                              <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                              <button onClick={() => openEditBlockModal(block)} className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                              <button onClick={() => handleDeleteBlock(block.id)} className="p-1 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                          
                          {block.options.length === 0 ? (
                            <p className="text-xs text-slate-400 italic px-6 py-2">No options in this block.</p>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {block.options.map((option) => (
                                <div key={option.id} className="relative group bg-white dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-300 transition-colors cursor-pointer overflow-hidden shadow-sm">
                                  
                                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded p-1 shadow-sm border border-slate-100 dark:border-slate-700">
                                    <button onClick={(e) => { e.stopPropagation(); openEditOptionModal(option); }} className="p-1 text-slate-400 hover:text-indigo-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700"><Edit2 className="w-3 h-3" /></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteOption(option.id); }} className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 dark:hover:bg-red-900/30"><Trash2 className="w-3 h-3" /></button>
                                  </div>

                                  <div className="font-medium text-sm text-slate-900 dark:text-white flex items-center gap-2 pr-12">
                                    <span className="truncate">{option.name}</span>
                                    {option.imageUrl && <ImageIcon className="w-3 h-3 text-indigo-400 shrink-0" />}
                                  </div>
                                  <div className="text-xs text-slate-500 mt-2 flex justify-between items-center">
                                    <span className="uppercase tracking-wider font-semibold">{option.type}</span>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">${option.price}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* --- MODALS --- */}

      <Modal isOpen={isStepModalOpen} onClose={() => setIsStepModalOpen(false)} title={stepFormData.id ? "Edit Step" : "Add New Step"} maxWidth="2xl">
        <form onSubmit={handleSaveStep} className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Step Number</label>
              <input type="number" required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900" value={stepFormData.stepNumber} onChange={(e) => setStepFormData({ ...stepFormData, stepNumber: e.target.value })} placeholder="1" />
            </div>
            <div className="col-span-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
              <input type="text" required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900" value={stepFormData.title} onChange={(e) => setStepFormData({ ...stepFormData, title: e.target.value })} placeholder="e.g. Sales Strategy" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea rows={4} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900 custom-scrollbar" value={stepFormData.description} onChange={(e) => setStepFormData({ ...stepFormData, description: e.target.value })} placeholder="Extensive description for this step..." />
          </div>
          <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={() => setIsStepModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50">{isLoading ? "Saving..." : stepFormData.id ? "Update Step" : "Save Step"}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isBlockModalOpen} onClose={() => setIsBlockModalOpen(false)} title={blockFormData.id ? "Edit Block" : "Add New Block"} maxWidth="2xl">
        <form onSubmit={handleSaveBlock} className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Block Name</label>
              <input type="text" required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900" value={blockFormData.name} onChange={(e) => setBlockFormData({ ...blockFormData, name: e.target.value })} placeholder="e.g. Pitch Deck" />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Display Order</label>
              <input type="number" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900" value={blockFormData.order} onChange={(e) => setBlockFormData({ ...blockFormData, order: e.target.value })} placeholder="0" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image URL (Optional Default Block Image)</label>
            <input type="text" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900" value={blockFormData.imageUrl} onChange={(e) => setBlockFormData({ ...blockFormData, imageUrl: e.target.value })} placeholder="https://example.com/image.png" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea rows={4} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900 custom-scrollbar" value={blockFormData.description} onChange={(e) => setBlockFormData({ ...blockFormData, description: e.target.value })} placeholder="Extensive block description..." />
          </div>
          <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={() => setIsBlockModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50">{isLoading ? "Saving..." : blockFormData.id ? "Update Block" : "Save Block"}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isOptionModalOpen} onClose={() => setIsOptionModalOpen(false)} title={optionFormData.id ? "Edit Option" : "Add New Option"} maxWidth="2xl">
        <form onSubmit={handleSaveOption} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Option Name</label>
              <input type="text" required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900" value={optionFormData.name} onChange={(e) => setOptionFormData({ ...optionFormData, name: e.target.value })} placeholder="e.g. Hire Human SDR" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Details Title (Optional)</label>
              <input type="text" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900" value={optionFormData.detailsTitle} onChange={(e) => setOptionFormData({ ...optionFormData, detailsTitle: e.target.value })} placeholder="e.g. What is included?" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
              <select required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900" value={optionFormData.type} onChange={(e) => setOptionFormData({ ...optionFormData, type: e.target.value })}>
                <option value="service">Service (Done for you)</option>
                <option value="template">Template (Funnel flow)</option>
                <option value="myself">Myself (DIY)</option>
                <option value="hire">Hire (Recruitment)</option>
                <option value="tool">Tool (Software)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Base Price ($)</label>
              <input type="number" step="0.01" required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900" value={optionFormData.price} onChange={(e) => setOptionFormData({ ...optionFormData, price: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image URL (Active when option is selected)</label>
            <input type="text" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900" value={optionFormData.imageUrl} onChange={(e) => setOptionFormData({ ...optionFormData, imageUrl: e.target.value })} placeholder="e.g. qualification-hire.png" />
          </div>

          {/* DYNAMIC VISUAL BUILDERS */}
          {optionFormData.type === 'template' ? (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Funnel Flow Steps</label>
                <button type="button" onClick={handleAddFunnelStep} className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                  <Plus className="w-3 h-3 mr-1" /> Add Step
                </button>
              </div>
              
              {templateData.flow.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No steps defined. Add one to build the visual flow.</p>
              ) : (
                <div className="space-y-2">
                  {templateData.flow.map((step: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1/3">
                        <select className="w-full text-sm px-2 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900" value={step.icon} onChange={(e) => handleFunnelStepChange(idx, 'icon', e.target.value)}>
                          {AVAILABLE_ICONS.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                        </select>
                      </div>
                      <div className="flex-1">
                        <input type="text" className="w-full text-sm px-2 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900" placeholder="e.g. Landing Page" value={step.label} onChange={(e) => handleFunnelStepChange(idx, 'label', e.target.value)} />
                      </div>
                      <button type="button" onClick={() => handleRemoveFunnelStep(idx)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4 space-y-3">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Implementation Pricing</label>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold w-16 text-slate-500">Service:</span>
                  <div className="relative flex items-center w-1/3">
                    <span className="absolute left-2 text-slate-400 text-sm">$</span>
                    <input type="number" className="w-full text-sm pl-5 pr-2 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900" placeholder="Price" value={templateData.service.price} onChange={(e) => handleTemplatePricingChange('service', 'price', e.target.value)} />
                  </div>
                  <div className="flex-1">
                    <input type="text" className="w-full text-sm px-2 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900" placeholder="SLA (e.g. 5 Days)" value={templateData.service.sla} onChange={(e) => handleTemplatePricingChange('service', 'sla', e.target.value)} />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold w-16 text-slate-500">Hire:</span>
                  <div className="relative flex items-center w-1/3">
                    <span className="absolute left-2 text-slate-400 text-sm">$</span>
                    <input type="number" className="w-full text-sm pl-5 pr-2 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900" placeholder="Price" value={templateData.hire.price} onChange={(e) => handleTemplatePricingChange('hire', 'price', e.target.value)} />
                  </div>
                  <div className="flex-1">
                    <input type="text" className="w-full text-sm px-2 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900" placeholder="SLA (e.g. 10 Days)" value={templateData.hire.sla} onChange={(e) => handleTemplatePricingChange('hire', 'sla', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          ) : optionFormData.type === 'hire' ? (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Specialist Grades (Levels)</label>
                <button type="button" onClick={handleAddHireGrade} className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                  <Plus className="w-3 h-3 mr-1" /> Add Grade
                </button>
              </div>
              
              {hireGradesData.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No grades defined. Add one to show a dropdown.</p>
              ) : (
                <div className="space-y-2">
                  {hireGradesData.map((grade: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="flex-1">
                        <input type="text" className="w-full text-sm px-2 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900" placeholder="e.g. Junior" value={grade.label} onChange={(e) => handleHireGradeChange(idx, 'label', e.target.value)} />
                      </div>
                      <div className="w-24">
                        <div className="relative flex items-center">
                          <span className="absolute left-2 text-slate-400 text-sm">$</span>
                          <input type="number" className="w-full text-sm pl-5 pr-2 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900" placeholder="Price" value={grade.price} onChange={(e) => handleHireGradeChange(idx, 'price', e.target.value)} />
                        </div>
                      </div>
                      <div className="w-24">
                        <input type="text" className="w-full text-sm px-2 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900" placeholder="SLA (14 Days)" value={grade.sla} onChange={(e) => handleHireGradeChange(idx, 'sla', e.target.value)} />
                      </div>
                      <button type="button" onClick={() => handleRemoveHireGrade(idx)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Advanced Configuration (Optional JSON)</label>
              <p className="text-[10px] text-slate-500 mb-1">Used by developers for complex integrations.</p>
              <textarea rows={2} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-mono text-sm dark:bg-slate-900/50 custom-scrollbar" value={optionFormData.grades} onChange={(e) => setOptionFormData({ ...optionFormData, grades: e.target.value })} placeholder="{}" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Option Description (Bullets)</label>
            <p className="text-[10px] text-slate-500 mb-1">Separate each bullet point with a new line (Enter).</p>
            <textarea rows={4} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900 custom-scrollbar" value={optionFormData.bullets} onChange={(e) => setOptionFormData({ ...optionFormData, bullets: e.target.value })} placeholder="First bullet point here...&#10;Second bullet point here..." />
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={() => setIsOptionModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50">{isLoading ? "Saving..." : optionFormData.id ? "Update Option" : "Save Option"}</button>
          </div>
        </form>
      </Modal>

    </div>
  );
}