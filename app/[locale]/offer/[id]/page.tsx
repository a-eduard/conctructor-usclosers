/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Check, AlertCircle, ShoppingCart, Zap, Users, Info, X, ShieldAlert,
} from "lucide-react";
import { animate, motion, AnimatePresence } from "motion/react";
import { SetupWizardHeader } from "../../../../components/SetupWizardHeader";

function EducationalTooltip({ content }: { content: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const isTouchDevice = useRef(false);

  useEffect(() => {
    isTouchDevice.current =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }, []);

  const handleMouseEnter = () => {
    if (!isTouchDevice.current) setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice.current) setIsOpen(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isTouchDevice.current) {
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    if (!isOpen || !isTouchDevice.current) return;
    const close = () => setIsOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [isOpen]);

  return (
    <div
      className="relative inline-flex items-center align-middle ml-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <button
        type="button"
        aria-label="Details"
        className="text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full"
      >
        <Info className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15, delay: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 p-3 bg-slate-900 text-white text-xs leading-relaxed rounded-xl shadow-xl border border-slate-700 pointer-events-auto"
          >
            {isTouchDevice.current && (
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            <div className="whitespace-pre-wrap break-words">{content}</div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ... Keep your type definitions (Vendor, Option, Component, Preset, OfferDetail) here
type Vendor = { id: string; name: string; rating: string; };
type Option = { id: string; name: string; description: string; priceDelta: string; isDefault: boolean; type: string; requiresUpload: boolean; whyNeedThis?: string; vendor?: Vendor; unitName?: string; minQuantity?: number; maxQuantity?: number; step?: number; slaImpact?: string; };
type Component = { id: string; name: string; type: string; description: string; whyNeedThis?: string; options: Option[]; };
type Preset = { presetId: string; name: string; description: string; icon: string; selectedOptionIds: string[]; };
type OfferDetail = { id: string; name: string; concept: string; pain: string; action: string; features: string[]; rulesEngine?: any; presets?: Preset[]; basePrice: string; deliverySla: string; components: Component[]; category?: { id: string; name: string }; };

function AnimatedPrice({ value }: { value: number }) {
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(
      parseFloat(node.textContent?.replace("$", "") || "0"),
      value,
      {
        duration: 0.5,
        ease: "easeOut",
        onUpdate(v) {
          node.textContent = `$${v.toFixed(2)}`;
        },
      },
    );

    return () => controls.stop();
  }, [value]);

  return (
    <div
      ref={nodeRef}
      className="text-4xl font-extrabold font-mono text-slate-900"
    >
      ${value.toFixed(2)}
    </div>
  );
}

export default function Configurator() {
  const params = useParams();
  const id = params.id as string;
  
  const [offer, setOffer] = useState<OfferDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [selections, setSelections] = useState<Record<string, string | string[]>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [files, setFiles] = useState<Record<string, File>>({});
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const getComponentImage = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('lead')) return 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800';
    if (lower.includes('sdr') || lower.includes('rep') || lower.includes('closer')) return 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800';
    if (lower.includes('infra')) return 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800';
    if (lower.includes('add-on') || lower.includes('addon')) return 'https://images.unsplash.com/photo-1507925922837-3347b7444b02?auto=format&fit=crop&q=80&w=800';
    return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800';
  };

  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/offers/${id}`)
      .then((res) => res.json())
      .then((data: OfferDetail) => {
        setOffer(data);
        const presetToApply = data.presets?.find((p) => p.presetId === activePresetId) || null;
        const initialSelections: Record<string, string | string[]> = {};
        data.components.forEach((comp) => {
          if (presetToApply) {
            if (comp.type === 'addon') {
              initialSelections[comp.id] = comp.options.filter(o => presetToApply.selectedOptionIds.includes(o.id)).map(o => o.id);
            } else {
              const presetOpt = comp.options.find((o) => presetToApply.selectedOptionIds.includes(o.id));
              if (presetOpt) initialSelections[comp.id] = presetOpt.id;
              else {
                const defaultOpt = comp.options.find((o) => o.isDefault);
                if (defaultOpt) initialSelections[comp.id] = defaultOpt.id;
              }
            }
          } else {
            if (comp.type === 'addon') {
              initialSelections[comp.id] = comp.options.filter((o) => o.isDefault).map((o) => o.id);
            } else {
              const defaultOpt = comp.options.find((o) => o.isDefault);
              if (defaultOpt) initialSelections[comp.id] = defaultOpt.id;
            }
          }
        });
        setSelections(initialSelections);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
  }, [id]);

  const applyPreset = (preset: Preset) => {
    if (!offer) return;
    const newSelections: Record<string, string | string[]> = {};
    offer.components.forEach((comp) => {
      if (comp.type === 'addon') {
        newSelections[comp.id] = comp.options.filter(o => preset.selectedOptionIds.includes(o.id)).map(o => o.id);
      } else {
        const presetOpt = comp.options.find((o) => preset.selectedOptionIds.includes(o.id));
        if (presetOpt) newSelections[comp.id] = presetOpt.id;
        else {
          const defaultOpt = comp.options.find((o) => o.isDefault);
          if (defaultOpt) newSelections[comp.id] = defaultOpt.id;
        }
      }
    });
    setSelections(newSelections);
    setActivePresetId(preset.presetId);
    setToastMessage(`Applied ${preset.name}. Configuration updated.`);
  };

  const rules = useMemo(() => {
    if (!offer?.rulesEngine) return [];
    return Array.isArray(offer.rulesEngine)
      ? offer.rulesEngine
      : offer.rulesEngine.rulesEngine || [];
  }, [offer]);

  const activeRules = useMemo(() => {
    return rules.filter((rule: any) => {
      if (rule.trigger.condition === "OPTION_SELECTED") {
        return Object.values(selections).flat().includes(rule.trigger.targetId);
      }
      if (rule.trigger.condition === "QUANTITY_GREATER_THAN") {
        const qty = quantities[rule.trigger.targetId] || 0;
        return qty > rule.trigger.value;
      }
      return false;
    });
  }, [selections, quantities, rules]);

  const effectiveSelections = useMemo(() => {
    let newSelections = { ...selections };
    activeRules.forEach((rule: any) => {
      if (rule.effect === "EXCLUDE" && rule.actionTarget.type === "COMPONENT") {
        if (Array.isArray(newSelections[rule.actionTarget.targetId])) {
           newSelections[rule.actionTarget.targetId] = [];
        } else {
           delete newSelections[rule.actionTarget.targetId];
        }
      }
      if (rule.effect === "EXCLUDE_OPTION" && rule.actionTarget.type === "OPTION") {
         const targetOptId = rule.actionTarget.targetId;
         Object.keys(newSelections).forEach(compId => {
             const selected = newSelections[compId];
             if (Array.isArray(selected)) {
                 newSelections[compId] = selected.filter(id => id !== targetOptId);
             } else {
                 if (selected === targetOptId) delete newSelections[compId];
             }
         });
      }
      if (
        (rule.effect === "AUTO_SELECT" || rule.effect === "REQUIRE") &&
        rule.actionTarget.type === "OPTION"
      ) {
        const targetOptId = rule.actionTarget.targetId;
        const comp = offer?.components.find((c) =>
          c.options.some((o) => o.id === targetOptId),
        );
        if (comp) {
          if (comp.type === 'addon') {
             const current = Array.isArray(newSelections[comp.id]) ? newSelections[comp.id] as string[] : [];
             if (!current.includes(targetOptId)) newSelections[comp.id] = [...current, targetOptId];
          } else {
             newSelections[comp.id] = targetOptId;
          }
        }
      }
    });
    return newSelections;
  }, [selections, activeRules, offer]);

  const visibleComponents = useMemo(() => {
    if (!offer) return [];
    return offer.components.filter(
      (comp) =>
        !activeRules.some(
          (r: any) =>
            r.effect === "EXCLUDE" &&
            r.actionTarget?.type === "COMPONENT" &&
            r.actionTarget?.targetId === comp.id,
        ),
    );
  }, [offer, activeRules]);

  const handleSelect = (compId: string, optId: string) => {
    const comp = offer?.components.find(c => c.id === compId);
    if (comp?.type === 'addon') {
       const current = Array.isArray(selections[compId]) ? selections[compId] as string[] : [];
       if (current.includes(optId)) {
           setSelections({ ...selections, [compId]: current.filter(id => id !== optId) });
       } else {
           setSelections({ ...selections, [compId]: [...current, optId] });
       }
    } else {
       setSelections({ ...selections, [compId]: optId });
    }
    setActivePresetId(null);
  };

  const handleFileUpload = (
    compId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles({ ...files, [compId]: e.target.files[0] });
    }
  };

  const calculateTotal = () => {
    if (!offer) return 0;
    let total = parseFloat(offer.basePrice);
    Object.entries(effectiveSelections).forEach(([compId, selectedVals]) => {
      const comp = offer.components.find((c) => c.id === compId);
      const arr = Array.isArray(selectedVals) ? selectedVals : [selectedVals];
      arr.forEach(optId => {
          const opt = comp?.options.find((o) => o.id === optId);
          if (opt) {
            const qty = quantities[optId] ?? opt.minQuantity ?? 1;
            total += parseFloat(opt.priceDelta) * qty;
          }
      });
    });
    return total;
  };

  const getMissingUploads = () => {
    if (!offer) return [];
    const missing: string[] = [];
    Object.entries(effectiveSelections).forEach(([compId, selectedVals]) => {
      const comp = offer.components.find((c) => c.id === compId);
      const arr = Array.isArray(selectedVals) ? selectedVals : [selectedVals];
      arr.forEach(optId => {
          const opt = comp?.options.find((o) => o.id === optId);
          if (opt?.requiresUpload && !files[compId]) {
            missing.push(`${comp!.name} (${opt.name})`);
          }
      });
    });
    return missing;
  };

  const isSlaDowngraded = useMemo(() => {
    if (!offer) return false;
    return Object.entries(effectiveSelections).some(([compId, selectedVals]) => {
      const comp = offer.components.find((c) => c.id === compId);
      const arr = Array.isArray(selectedVals) ? selectedVals : [selectedVals];
      return arr.some(optId => {
        const opt = comp?.options.find((o) => o.id === optId);
        return opt?.slaImpact === "DOWNGRADE_TO_BASIC";
      });
    });
  }, [offer, effectiveSelections]);

  const canCheckout = () => {
    if (getMissingUploads().length > 0) return false;
    if (isSlaDowngraded && !consentGiven) return false;
    return true;
  };

  if (loading)
    return <div className="flex items-center justify-center h-screen bg-slate-50 text-slate-500 font-mono">Loading configurator...</div>;
  
  if (!offer)
    return <div className="p-12 text-center text-red-500 font-mono">Offer not found or API is disconnected.</div>;

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <SetupWizardHeader showBackButton={true} />

      <div className="flex flex-1 flex-col lg:flex-row h-[calc(100vh-4rem)]">
        <div className="w-full lg:w-3/5 p-8 flex flex-col overflow-y-auto border-r border-slate-200 pb-24 lg:pb-8">
          <div className="shrink-0 max-w-3xl mb-12">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-slate-400 text-sm">
                • Category: {offer.category?.name || "Solution"}
              </span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-4 leading-tight">
              {offer.name}
            </h1>
            <p className="text-slate-500 max-w-md">{offer.concept}</p>
          </div>

          {offer.presets && offer.presets.length > 0 && (
            <div className="mb-12 shrink-0 max-w-3xl">
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
                {offer.presets.map((preset) => {
                  const isActive = activePresetId === preset.presetId;
                  const Icon = preset.icon === "Zap" ? Zap : preset.icon === "Users" ? Users : Check;

                  return (
                    <button
                      key={preset.presetId}
                      onClick={() => applyPreset(preset)}
                      className={`text-left p-5 rounded-2xl border-2 transition-all duration-300 min-w-[240px] snap-start shrink-0 relative overflow-hidden group ${
                        isActive
                          ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-200"
                          : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute top-0 right-0 p-3">
                          <Check className="w-5 h-5 text-indigo-300 opacity-50" />
                        </div>
                      )}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-indigo-600 group-hover:bg-indigo-100"}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className={`font-extrabold text-base mb-1 ${isActive ? "text-white" : "text-slate-900"}`}>
                        {preset.name}
                      </h4>
                      <p className={`text-xs leading-relaxed font-medium ${isActive ? "text-indigo-100" : "text-slate-500"}`}>
                        {preset.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="shrink-0 max-w-3xl">
            <div className="flex flex-col gap-3 w-full bg-slate-100/50 p-4 rounded-3xl border border-slate-200/60">
              {offer.components
                .filter((comp) => {
                  const selection = effectiveSelections[comp.id];
                  return Array.isArray(selection) ? selection.length > 0 : !!selection;
                })
                .map((comp) => {
                  const selection = effectiveSelections[comp.id];
                  const selectedOptions = Array.isArray(selection) 
                    ? comp.options.filter(o => selection.includes(o.id))
                    : [comp.options.find(o => o.id === selection)].filter(Boolean);

                  return (
                    <div
                      key={comp.id}
                      className="p-5 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center gap-4 transition-all hover:border-indigo-200"
                    >
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                        <Check className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">
                          {comp.name}
                        </span>
                        <div className="flex flex-col gap-1.5">
                          {selectedOptions.map((opt: any) => (
                            <div key={opt.id} className="flex items-center gap-2">
                              <h3 className="font-bold text-base text-slate-900 leading-none">
                                {opt.name}
                              </h3>
                              {opt.vendor && (
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold">
                                  by {opt.vendor.name}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="mt-12 shrink-0 max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div>
                <h3 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3">The Problem</h3>
                <p className="text-slate-600 bg-slate-100/70 p-5 rounded-2xl border border-slate-200/50 leading-relaxed text-sm shadow-sm">{offer.pain}</p>
              </div>
              <div>
                <h3 className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold mb-3">Our Solution</h3>
                <p className="text-indigo-900 bg-indigo-50/70 p-5 rounded-2xl border border-indigo-100/50 leading-relaxed text-sm shadow-sm">{offer.action}</p>
              </div>
            </div>
            <div>
              <h3 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3">What You Get</h3>
              <ul className="flex flex-col gap-3">
                {offer.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm transition-colors hover:border-slate-300">
                    <div className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 leading-snug">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar Configuratior Area */}
        <div className="w-full lg:w-2/5 bg-white px-8 pt-8 flex flex-col overflow-y-auto relative">
          {toastMessage && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="bg-indigo-900 text-white px-4 py-3 rounded-xl shadow-lg text-xs font-medium flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-400" />
                {toastMessage}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mb-6 shrink-0">
            <h2 className="text-lg font-bold text-slate-900">Configure Solution</h2>
            <div className="flex items-center gap-1.5">
              {visibleComponents.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className="flex items-center outline-none cursor-pointer p-0.5"
                >
                  <div className={`h-2 rounded-full transition-all duration-300 ${idx === currentStep ? "w-8 bg-indigo-600" : idx < currentStep ? "w-2 bg-indigo-600" : "w-2 bg-slate-200"}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-8 flex flex-col min-h-0">
            {activeRules.length > 0 && (
              <div className="space-y-3">
                {activeRules.map((r: any) =>
                  r.uiMessage ? (
                    <div key={r.ruleId} className="px-4 py-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-3">
                      <Check className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                      <span className="text-xs text-indigo-900 font-medium">{r.uiMessage}</span>
                    </div>
                  ) : null,
                )}
              </div>
            )}

            {visibleComponents.length > 0 && currentStep < visibleComponents.length && (() => {
              const comp = visibleComponents[currentStep];
              return (
                <div className="space-y-6 flex-1 flex flex-col min-h-0 animate-in fade-in zoom-in-95 duration-300">
                  <div className="relative h-48 rounded-2xl overflow-hidden shrink-0 border border-slate-200 shadow-sm">
                    <img src={getComponentImage(comp.name)} alt={comp.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex justify-between items-center">
                        <label className="text-xl font-extrabold uppercase text-white tracking-widest flex items-center">{comp.name}</label>
                        {comp.type === "required" && <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Required</span>}
                      </div>
                      <p className="text-sm text-slate-300 mt-1">{comp.description}</p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {comp.type === "addon" ? (
                      <div className="flex flex-col gap-3">
                        {comp.options.map((opt) => {
                          const currentSelections = Array.isArray(effectiveSelections[comp.id]) ? effectiveSelections[comp.id] : [];
                          const active = currentSelections.includes(opt.id);
                          const priceDeltaNum = parseFloat(opt.priceDelta);
                          return (
                            <div key={opt.id} onClick={() => handleSelect(comp.id, opt.id)} className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${active ? "border-indigo-600 bg-indigo-50/50" : "border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50"}`}>
                              <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${active ? "bg-indigo-600 border-indigo-600" : "bg-white border-slate-300"}`}>
                                  {active && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <span className={`text-sm font-semibold ${active ? "text-indigo-950" : "text-slate-700"}`}>{opt.name}</span>
                                {opt.whyNeedThis && <EducationalTooltip content={opt.whyNeedThis} />}
                              </div>
                              <span className={`text-sm font-bold ${active ? "text-indigo-600" : "text-slate-500"}`}>{priceDeltaNum > 0 ? `+$${priceDeltaNum}` : "Included"}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {comp.options.map((opt) => {
                          const active = effectiveSelections[comp.id] === opt.id;
                          const priceDeltaNum = parseFloat(opt.priceDelta);
                          return (
                            <div key={opt.id} className="relative">
                              <div onClick={() => handleSelect(comp.id, opt.id)} className={`p-5 rounded-2xl flex items-center justify-between cursor-pointer transition-all border-2 ${active ? "border-indigo-600 bg-indigo-50/30 shadow-sm" : "border-slate-100 bg-white hover:border-indigo-300 hover:bg-slate-50 hover:shadow-sm"}`}>
                                <div className="flex items-center gap-4">
                                  <div className={`w-5 h-5 rounded-full shrink-0 border-2 flex items-center justify-center ${active ? "border-indigo-600" : "border-slate-300"}`}>
                                    {active && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                                  </div>
                                  <div>
                                    <span className={`text-base font-bold flex items-center ${active ? "text-indigo-950" : "text-slate-700"}`}>
                                      {opt.name}
                                      {opt.slaImpact === "DOWNGRADE_TO_BASIC" && <span className="ml-2 text-amber-500" title="This option changes delivery terms"><ShieldAlert className="w-4 h-4 inline-block" /></span>}
                                      {opt.whyNeedThis && <EducationalTooltip content={opt.whyNeedThis} />}
                                    </span>
                                    <div className="text-xs text-slate-500 mt-1 line-clamp-1">{opt.description}</div>
                                  </div>
                                </div>
                                <span className={`text-sm font-extrabold shrink-0 ml-4 ${active ? "text-indigo-600" : "text-slate-400"}`}>
                                  {priceDeltaNum === 0 ? "Included" : `+$${priceDeltaNum}`}
                                </span>
                              </div>

                              {active && opt.maxQuantity && opt.maxQuantity > (opt.minQuantity || 1) && (
                                <div className="mt-2 p-5 bg-white border border-indigo-100 shadow-sm rounded-2xl relative z-10 before:absolute before:-top-2 before:left-8 before:w-4 before:h-4 before:bg-white before:border-l before:border-t before:border-indigo-100 before:rotate-45">
                                  <div className="flex justify-between items-center mb-4 relative z-10">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Volume: <span className="text-indigo-950">{quantities[opt.id] ?? opt.minQuantity ?? 1} {opt.unitName || "Units"}</span></span>
                                    <span className="text-sm font-extrabold text-indigo-600">+${priceDeltaNum * (quantities[opt.id] ?? opt.minQuantity ?? 1)}</span>
                                  </div>
                                  <input type="range" min={opt.minQuantity || 1} max={opt.maxQuantity} step={opt.step || 1} value={quantities[opt.id] ?? opt.minQuantity ?? 1} onChange={(e) => setQuantities({ ...quantities, [opt.id]: parseInt(e.target.value) })} className="w-full accent-indigo-600 h-2.5 bg-slate-100 rounded-full appearance-none cursor-pointer relative z-10" />
                                </div>
                              )}

                              {active && opt.requiresUpload && (
                                <div className="mt-2 p-5 bg-orange-50/50 rounded-2xl border border-orange-200 relative z-10 before:absolute before:-top-2 before:left-8 before:w-4 before:h-4 before:bg-orange-50/50 before:border-l before:border-t before:border-orange-200 before:rotate-45">
                                  <div className="flex items-center gap-2 mb-2 text-orange-800 text-xs font-bold uppercase tracking-wider relative z-10"><AlertCircle className="w-4 h-4 shrink-0" />Action Required</div>
                                  <p className="text-xs text-orange-900/80 mb-4 font-medium relative z-10">You selected "Bring Your Own". Please upload your CSV file to proceed.</p>
                                  <div className="relative z-10"><input type="file" accept=".csv" className="text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-white file:text-orange-700 file:shadow-sm hover:file:bg-orange-50 cursor-pointer w-full" onChange={(e) => handleFileUpload(comp.id, e)} /></div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-4 shrink-0 mt-4">
                    <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0} className="px-6 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Previous</button>
                    <button onClick={() => setCurrentStep(Math.min(visibleComponents.length - 1, currentStep + 1))} disabled={currentStep === visibleComponents.length - 1} className="flex-1 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Next Step</button>
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="sticky bottom-0 left-0 right-0 bg-white pt-6 pb-8 border-t border-slate-100 shrink-0 z-20 mt-8 shadow-[0_-15px_30px_-15px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-end mb-6">
              <div><AnimatedPrice value={calculateTotal()} /></div>
            </div>

            {getMissingUploads().length > 0 && (
              <div className="mb-4 text-xs text-orange-800 bg-orange-50 p-3 rounded-xl border border-orange-100 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Missing uploads for: {getMissingUploads().join(", ")}</span>
              </div>
            )}

            {isSlaDowngraded && (
              <div className="mb-4">
                <div className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-start gap-2 mb-3">
                  <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
                  <div><strong>Notice:</strong> Selecting external resources moves this order to Best Effort SLA.</div>
                </div>
                <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer mb-2">
                  <input type="checkbox" checked={consentGiven} onChange={(e) => setConsentGiven(e.target.checked)} className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  <span>I agree that using external assets waives outcome guarantees.</span>
                </label>
              </div>
            )}

            <button
              disabled={!canCheckout()}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
            >
              Ship Solution Outcome <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}