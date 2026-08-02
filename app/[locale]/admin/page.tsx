/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import {
  ArrowLeft, Plus, Settings, Users, Box, LayoutGrid, ListTodo,
} from "lucide-react";

function AdminSidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) {
  const locale = useLocale();
  const links = [
    { id: "orders", name: "Orders & Tasks", icon: <ListTodo className="w-4 h-4 mr-3" /> },
    { id: "offers", name: "Offers", icon: <Box className="w-4 h-4 mr-3" /> },
    { id: "categories", name: "Categories", icon: <LayoutGrid className="w-4 h-4 mr-3" /> },
    { id: "vendors", name: "Vendors", icon: <Users className="w-4 h-4 mr-3" /> },
    { id: "settings", name: "Settings", icon: <Settings className="w-4 h-4 mr-3" /> },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 shrink-0 flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <a
          href={`/${locale}`}
          className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 block mb-6"
        >
          FOUNDRY.CMS
        </a>
        <a
          href={`/${locale}`}
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Store
        </a>
      </div>
      <div className="p-4 flex-1 space-y-1">
        {links.map((link) => {
          const active = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {link.icon}
              {link.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function OffersAdmin() {
  const [offers, setOffers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [editingComponents, setEditingComponents] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"basic" | "rules" | "presets">("basic");
  const [rulesEngineStr, setRulesEngineStr] = useState("");
  const [presetsStr, setPresetsStr] = useState("");

  const [formData, setFormData] = useState({
    name: "", categoryId: "", basePrice: "", deliverySla: "", concept: "", pain: "", action: "", features: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [offersRes, categoriesRes] = await Promise.all([
        fetch("/api/offers").then((res) => res.ok ? res.json() : []),
        fetch("/api/categories").then((res) => res.ok ? res.json() : []),
      ]);
      setOffers(offersRes);
      setCategories(categoriesRes);
    } catch(e) {
      console.log(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingOffer(null);
    setFormData({
      name: "", categoryId: categories.length > 0 ? categories[0].id : "", basePrice: "", deliverySla: "", concept: "", pain: "", action: "", features: "",
    });
    setRulesEngineStr("[]");
    setPresetsStr("[]");
    setActiveTab("basic");
    setIsModalOpen(true);
  };

  const openEditModal = (offer: any) => {
    setEditingOffer(offer);
    setFormData({
      name: offer.name || "", categoryId: offer.categoryId || "", basePrice: offer.basePrice || "", deliverySla: offer.deliverySla || "", concept: offer.concept || "", pain: offer.pain || "", action: offer.action || "",
      features: Array.isArray(offer.features) ? offer.features.join("\n") : offer.features || "",
    });
    setRulesEngineStr(JSON.stringify(offer.rulesEngine || [], null, 2));
    setPresetsStr(JSON.stringify(offer.presets || [], null, 2));
    setActiveTab("basic");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    let parsedRules = [];
    let parsedPresets = [];
    try {
      parsedRules = JSON.parse(rulesEngineStr);
      parsedPresets = JSON.parse(presetsStr);
    } catch(err) {
      alert("Invalid JSON in Rules or Presets tab");
      return;
    }

    const payload = {
      ...formData,
      features: formData.features.split("\n").map((f) => f.trim()).filter((f) => f),
      rulesEngine: parsedRules,
      presets: parsedPresets
    };

    if (editingOffer) {
      await fetch(`/api/offers/${editingOffer.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), });
    } else {
      await fetch("/api/offers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), });
    }

    setIsModalOpen(false);
    fetchData();
  };

  const deleteOffer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;
    await fetch(`/api/offers/${id}`, { method: "DELETE" });
    fetchData();
  };

  if (loading) return <div className="p-8 text-slate-500">Loading offers...</div>;

  return (
    <div className="p-8 animate-in fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Offers</h1>
          <p className="text-sm text-slate-500 mt-1">Manage solution bundles shown on the storefront.</p>
        </div>
        <button onClick={openCreateModal} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center transition-colors">
          <Plus className="w-4 h-4 mr-2" /> New Offer
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-600">Name</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Category</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Base Price</th>
              <th className="px-6 py-4 font-semibold text-slate-600">SLA</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {offers.map((offer) => (
              <tr key={offer.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{offer.name}</td>
                <td className="px-6 py-4 text-slate-600">{offer.category?.name}</td>
                <td className="px-6 py-4 text-slate-600">${offer.basePrice}</td>
                <td className="px-6 py-4 text-slate-600">{offer.deliverySla}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => setEditingComponents(offer)} className="text-slate-600 hover:text-slate-900 font-medium mr-4">Components</button>
                  <button onClick={() => openEditModal(offer)} className="text-indigo-600 hover:text-indigo-900 font-medium mr-4">Edit</button>
                  <button onClick={() => deleteOffer(offer.id)} className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                </td>
              </tr>
            ))}
            {offers.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No offers found.</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingOffer ? "Edit Offer" : "New Offer"}>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="flex border-b border-slate-200 mb-4 sticky top-0 bg-white z-10 pt-2">
            <button type="button" onClick={() => setActiveTab("basic")} className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === "basic" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>Basic Info</button>
            <button type="button" onClick={() => setActiveTab("rules")} className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === "rules" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>Rules Engine</button>
            <button type="button" onClick={() => setActiveTab("presets")} className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === "presets" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>Templates</button>
          </div>

          <div className={activeTab === "basic" ? "space-y-4" : "hidden"}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input type="text" required={activeTab === "basic"} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select required={activeTab === "basic"} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}>
                <option value="" disabled>Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Base Price</label>
                <input type="text" required={activeTab === "basic"} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={formData.basePrice} onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Delivery SLA</label>
                <input type="text" required={activeTab === "basic"} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={formData.deliverySla} onChange={(e) => setFormData({ ...formData, deliverySla: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Concept</label>
              <textarea rows={2} required={activeTab === "basic"} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={formData.concept} onChange={(e) => setFormData({ ...formData, concept: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pain Point</label>
              <textarea rows={2} required={activeTab === "basic"} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={formData.pain} onChange={(e) => setFormData({ ...formData, pain: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Action</label>
              <textarea rows={2} required={activeTab === "basic"} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={formData.action} onChange={(e) => setFormData({ ...formData, action: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Features (one per line)</label>
              <textarea rows={4} required={activeTab === "basic"} placeholder="Feature 1&#10;Feature 2" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 whitespace-pre" value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} />
            </div>
          </div>

          <div className={activeTab === "rules" ? "space-y-4" : "hidden"}>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Rules JSON</label>
              <p className="text-xs text-slate-500 mb-2">Define condition triggers for the wizard.</p>
              <textarea rows={14} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm bg-slate-50 whitespace-pre" value={rulesEngineStr} onChange={(e) => setRulesEngineStr(e.target.value)} />
             </div>
          </div>

          <div className={activeTab === "presets" ? "space-y-4" : "hidden"}>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Templates / Presets JSON</label>
              <p className="text-xs text-slate-500 mb-2">Pre-map option IDs to funnel stages.</p>
              <textarea rows={14} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm bg-slate-50 whitespace-pre" value={presetsStr} onChange={(e) => setPresetsStr(e.target.value)} />
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">Save</button>
          </div>
        </form>
      </Modal>

      {editingComponents && <OfferComponentsEditor offer={editingComponents} onClose={() => setEditingComponents(null)} />}
    </div>
  );
}

function OfferComponentsEditor({ offer, onClose }: { offer: any; onClose: () => void; }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/offers/${offer.id}`)
      .then((res) => res.json())
      .then((res) => { setData(res); setLoading(false); });
  }, [offer.id]);

  const handleComponentChange = (compId: string, val: string) => {
    const newData = { ...data };
    const comp = newData.components.find((c: any) => c.id === compId);
    if (comp) comp.whyNeedThis = val;
    setData(newData);
  };

  const handleOptionChange = (compId: string, optId: string, field: string, val: string | number) => {
    const newData = { ...data };
    const comp = newData.components.find((c: any) => c.id === compId);
    const opt = comp?.options.find((o: any) => o.id === optId);
    if (opt) opt[field] = val;
    setData(newData);
  };

  const saveComponent = async (compId: string, whyNeedThis: string) => {
    await fetch(`/api/components/${compId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ whyNeedThis }), });
  };

  const saveOption = async (opt: any) => {
    await fetch(`/api/options/${opt.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ whyNeedThis: opt.whyNeedThis, unitName: opt.unitName, minQuantity: opt.minQuantity, maxQuantity: opt.maxQuantity, step: opt.step, slaImpact: opt.slaImpact }), });
  };

  const saveAll = async () => {
    setLoading(true);
    for (const comp of data.components) {
      await saveComponent(comp.id, comp.whyNeedThis || "");
      for (const opt of comp.options) { await saveOption(opt); }
    }
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={`Edit Components: ${offer.name}`}>
      {loading ? (
        <div className="text-slate-500">Loading...</div>
      ) : (
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {data.components.map((comp: any) => (
            <div key={comp.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50">
              <h4 className="font-bold text-sm text-slate-900 mb-2">{comp.name} (Component)</h4>
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-600 mb-1">Why need this?</label>
                <textarea rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" value={comp.whyNeedThis || ""} onChange={(e) => handleComponentChange(comp.id, e.target.value)} />
              </div>

              <div className="space-y-3 pl-4 border-l-2 border-slate-200">
                <h5 className="text-xs font-bold text-slate-500 uppercase">Options</h5>
                {comp.options.map((opt: any) => (
                  <div key={opt.id}>
                    <h6 className="text-sm font-medium text-slate-800">{opt.name}</h6>
                    <textarea rows={2} className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" value={opt.whyNeedThis || ""} onChange={(e) => handleOptionChange(comp.id, opt.id, "whyNeedThis", e.target.value)} placeholder="Explain option value..." />
                    
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Unit Name</label>
                        <input type="text" className="w-full mt-1 px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs" value={opt.unitName || ""} onChange={(e) => handleOptionChange(comp.id, opt.id, "unitName", e.target.value)} placeholder="e.g. Demos, Months" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Min Qty</label>
                        <input type="number" className="w-full mt-1 px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs" value={opt.minQuantity || 1} onChange={(e) => handleOptionChange(comp.id, opt.id, "minQuantity", e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Max Qty</label>
                        <input type="number" className="w-full mt-1 px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs" value={opt.maxQuantity || 1} onChange={(e) => handleOptionChange(comp.id, opt.id, "maxQuantity", e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Step</label>
                        <input type="number" className="w-full mt-1 px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs" value={opt.step || 1} onChange={(e) => handleOptionChange(comp.id, opt.id, "step", e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">SLA Impact</label>
                        <select className="w-full mt-1 px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs bg-white" value={opt.slaImpact || "NONE"} onChange={(e) => handleOptionChange(comp.id, opt.id, "slaImpact", e.target.value)}>
                          <option value="NONE">None</option>
                          <option value="DOWNGRADE_TO_BASIC">Downgrade to Basic</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button type="button" onClick={saveAll} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">Save Tooltips</button>
          </div>
        </div>
      )}
    </Modal>
  );
}

function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><span className="text-2xl leading-none">&times;</span></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function CategoriesAdmin() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "" });

  const fetchCategories = () => {
    setLoading(true);
    fetch("/api/categories")
      .then((res) => res.ok ? res.json() : [])
      .then((data) => { setCategories(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const openCreateModal = () => { setEditingCategory(null); setFormData({ name: "" }); setIsModalOpen(true); };

  const openEditModal = (cat: any) => { setEditingCategory(cat); setFormData({ name: cat.name }); setIsModalOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingCategory) {
      await fetch(`/api/categories/${editingCategory.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData), });
    } else {
      await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData), });
    }
    setIsModalOpen(false);
    fetchCategories();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  if (loading) return <div className="p-8 text-slate-500">Loading categories...</div>;

  return (
    <div className="p-8 animate-in fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
          <p className="text-sm text-slate-500 mt-1">Manage offer categories.</p>
        </div>
        <button onClick={openCreateModal} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center transition-colors">
          <Plus className="w-4 h-4 mr-2" /> New Category
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden max-w-3xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-600">ID</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Name</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-500 font-mono text-xs">{cat.id}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{cat.name}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEditModal(cat)} className="text-indigo-600 hover:text-indigo-900 font-medium mr-4">Edit</button>
                  <button onClick={() => deleteCategory(cat.id)} className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">No categories found.</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCategory ? "Edit Category" : "New Category"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input type="text" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function VendorsAdmin() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", rating: "0" });

  const fetchVendors = () => {
    setLoading(true);
    fetch("/api/vendors")
      .then((res) => res.ok ? res.json() : [])
      .then((data) => { setVendors(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchVendors(); }, []);

  const openCreateModal = () => { setEditingVendor(null); setFormData({ name: "", rating: "0" }); setIsModalOpen(true); };

  const openEditModal = (vendor: any) => { setEditingVendor(vendor); setFormData({ name: vendor.name, rating: vendor.rating || "0" }); setIsModalOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingVendor) {
      await fetch(`/api/vendors/${editingVendor.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...formData, rating: parseFloat(formData.rating || "0") }), });
    } else {
      await fetch("/api/vendors", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...formData, rating: parseFloat(formData.rating || "0") }), });
    }
    setIsModalOpen(false);
    fetchVendors();
  };

  const deleteVendor = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vendor?")) return;
    await fetch(`/api/vendors/${id}`, { method: "DELETE" });
    fetchVendors();
  };

  if (loading) return <div className="p-8 text-slate-500">Loading vendors...</div>;

  return (
    <div className="p-8 animate-in fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vendors</h1>
          <p className="text-sm text-slate-500 mt-1">Manage external vendors and fulfillment partners.</p>
        </div>
        <button onClick={openCreateModal} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center transition-colors">
          <Plus className="w-4 h-4 mr-2" /> New Vendor
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden max-w-3xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-600">Name</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Rating</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{vendor.name}</td>
                <td className="px-6 py-4 text-slate-600">★ {vendor.rating}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEditModal(vendor)} className="text-indigo-600 hover:text-indigo-900 font-medium mr-4">Edit</button>
                  <button onClick={() => deleteVendor(vendor.id)} className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                </td>
              </tr>
            ))}
            {vendors.length === 0 && <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">No vendors found.</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingVendor ? "Edit Vendor" : "New Vendor"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input type="text" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rating (e.g. 4.5)</label>
            <input type="number" step="0.1" min="0" max="5" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function OrdersAdmin() {
  const [orders, setOrders] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderTasks, setOrderTasks] = useState<any[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, vendorsRes] = await Promise.all([
        fetch("/api/admin/orders").then(r => r.ok ? r.json() : []),
        fetch("/api/vendors").then(r => r.ok ? r.json() : [])
      ]);
      setOrders(ordersRes);
      setVendors(vendorsRes);
    } catch(e) { console.log(e); }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const loadTasks = async (order: any) => {
    setSelectedOrder(order);
    setTasksLoading(true);
    try {
      const tasksRes = await fetch(`/api/admin/orders/${order.id}/tasks`).then(r => r.json());
      setOrderTasks(tasksRes);
    } catch(e) { console.log(e); setOrderTasks([]); }
    setTasksLoading(false);
  };

  const updateTask = async (taskId: string, payload: any) => {
    await fetch(`/api/admin/tasks/${taskId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (selectedOrder) { loadTasks(selectedOrder); }
  };

  const closeModal = () => setSelectedOrder(null);

  if (loading) return <div className="p-8 text-slate-500">Loading orders...</div>;

  return (
    <div className="p-8 animate-in fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Orders & Tasks</h1>
        <p className="text-sm text-slate-500 mt-1">Orchestrate master orders and sub-tasks.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-600">ID</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Customer</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Date</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => loadTasks(order)}>
                <td className="px-6 py-4 text-slate-500 font-mono text-xs">{order.id}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{order.customerName}</div>
                  <div className="text-slate-500 text-xs">{order.customerEmail}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded">{order.status}</span>
                </td>
                <td className="px-6 py-4 text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">View Tasks</button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No orders found.</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!selectedOrder} onClose={closeModal} title={`Tasks for Order ${selectedOrder?.id?.slice(0,8)}`}>
        {tasksLoading ? (
          <div className="text-slate-500">Loading tasks...</div>
        ) : (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {orderTasks.map(task => {
              const isOverdue = task.slaDeadline && new Date(task.slaDeadline) < new Date() && !['COMPLETED', 'ACTIVE'].includes(task.status);
              return (
                <div key={task.id} className={`p-4 rounded-xl border ${isOverdue ? 'border-red-300 bg-red-50/30' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{task.option?.name || task.optionId}</h4>
                      <p className="text-xs text-slate-500 mt-1 font-mono">Task: {task.id}</p>
                    </div>
                    {isOverdue && <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">SLA Overdue</span>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Status</label>
                      <select className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" value={task.status} onChange={(e) => updateTask(task.id, { status: e.target.value })}>
                        <option value="DRAFT">DRAFT</option>
                        <option value="ACTION_REQUIRED">ACTION REQUIRED</option>
                        <option value="PENDING">PENDING</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="REVIEW">REVIEW</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="ACTIVE">ACTIVE</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Assign Vendor</label>
                      <select className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white" value={task.vendorId || ""} onChange={(e) => updateTask(task.id, { vendorId: e.target.value })}>
                        <option value="">Unassigned (Internal/AI)</option>
                        {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
            {orderTasks.length === 0 && <div className="text-slate-500">No tasks found.</div>}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState("offers");

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-y-auto">
        {activeTab === "offers" && <OffersAdmin />}
        {activeTab === "orders" && <OrdersAdmin />}
        {activeTab === "categories" && <CategoriesAdmin />}
        {activeTab === "vendors" && <VendorsAdmin />}
        {activeTab === "settings" && <div className="p-8">Settings - Work in progress</div>}
      </div>
    </div>
  );
}