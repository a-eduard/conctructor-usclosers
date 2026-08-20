"use client";

import React, { useState } from 'react';
import { useWizardStore } from '../context/WizardStore';
import { ArrowLeft, Check, Lock, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { ROLE_NAMES } from '../types/wizard.types';
import { useRouter } from 'next/navigation';

export const Step5Checkout: React.FC = () => {
  const router = useRouter();
  const { cart, segment, chosenPresetId, prevStep, resetWizard } = useWizardStore();
  const [formData, setFormData] = useState({ name: '', email: '', company: '', comments: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const cartItems = Object.values(cart);
  const totalRolesCost = cartItems.reduce((acc, item) => acc + (item.pricePerUnit * item.quantity), 0);
  const totalSeats = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  const infrastructureCost = chosenPresetId ? 0 : 999 + (10 * totalSeats);
  const totalMonthlyCost = totalRolesCost + infrastructureCost;

  const isEnterprise = segment === 'enterprise';
  const isCartEmpty = cartItems.length === 0;

  const getSegmentName = () => {
    switch (segment) {
      case 'startup': return 'Startup Profile';
      case 'smb': return 'SMB Profile';
      case 'enterprise': return 'Enterprise Profile';
      default: return 'Unknown';
    }
  };

  const handleCheckout = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isCartEmpty) return;

    setIsSubmitting(true);

    const payload = {
      customerSegment: segment,
      presetId: chosenPresetId,
      team: cartItems.map(item => ({
        roleId: item.roleId,
        quantity: item.quantity,
        price: item.pricePerUnit
      })),
      infrastructurePrice: infrastructureCost,
      totalMonthlyPrice: totalMonthlyCost,
      ...(isEnterprise && { contactInfo: formData })
    };

    console.log('Order Payload:', JSON.stringify(payload, null, 2));

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-background-secondary p-12 rounded-2xl border border-border-primary text-center max-w-2xl mx-auto my-12 transition-theme">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 transition-theme">
          <Check className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-text-primary mb-4 transition-theme">Thank You!</h2>
        <p className="text-text-secondary text-lg mb-8 transition-theme">
          {isEnterprise 
            ? "Your request has been received. Our Enterprise manager will contact you within 24 hours." 
            : "Your onboarding process will begin shortly. We've sent the details to your email."}
        </p>
        <button 
          onClick={() => { 
            resetWizard(); 
            router.push('/'); 
          }} 
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)]"
        >
          Return to Home
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 transition-theme">
      <div>
        <h1 className="text-3xl font-extrabold text-text-primary mb-4 transition-theme">Review & Checkout</h1>
        <p className="text-text-secondary text-lg transition-theme">Finalize your team configuration and proceed to onboarding.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left: Summary */}
        <div className="bg-background-secondary p-8 rounded-2xl border border-border-primary shadow-sm h-fit transition-theme">
          <h3 className="text-xl font-bold text-text-primary mb-6 transition-theme">Order Details</h3>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-border-primary transition-theme">
              <span className="text-text-secondary font-medium transition-theme">Business Segment</span>
              <span className="font-bold text-text-primary transition-theme">{getSegmentName()}</span>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-text-primary transition-theme">Team Composition</h4>
              {cartItems.length === 0 ? (
                <p className="text-sm text-text-secondary italic transition-theme">No roles selected</p>
              ) : (
                cartItems.map(item => (
                  <div key={item.roleId} className="flex justify-between items-center text-sm">
                    <span className="text-text-secondary transition-theme">{item.quantity} × {ROLE_NAMES[item.roleId] || item.roleId}</span>
                    <span className="font-semibold text-text-primary transition-theme">${(item.quantity * item.pricePerUnit).toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-between items-center py-4 border-t border-b border-border-primary transition-theme">
              <span className="font-semibold text-text-primary transition-theme">Sales Ops Cloud</span>
              <span className="font-semibold text-text-primary transition-theme">
                {chosenPresetId ? <span className="text-emerald-600 dark:text-emerald-400">Included</span> : `$${infrastructureCost.toLocaleString()}`}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-bold text-text-primary transition-theme">Grand Total</span>
              {isEnterprise ? (
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400 transition-theme">Custom Quote</span>
              ) : (
                <span className="text-2xl font-extrabold text-text-primary transition-theme">${totalMonthlyCost.toLocaleString()}<span className="text-sm text-text-secondary font-medium transition-theme">/mo</span></span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Action Area */}
        <div>
          {isEnterprise ? (
            <div className="bg-slate-900 p-8 rounded-2xl text-white shadow-xl transition-theme">
              <h3 className="text-2xl font-bold mb-2">Request Custom Onboarding</h3>
              <p className="text-slate-400 mb-8 text-sm">Fill out the form below and our Enterprise team will prepare your custom SLA.</p>
              
              <form onSubmit={handleCheckout} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Work Email</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Company</label>
                  <input required type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Comments (Optional)</label>
                  <textarea value={formData.comments} onChange={e => setFormData({...formData, comments: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-24 resize-none" />
                </div>
                
                <button type="submit" disabled={isCartEmpty || isSubmitting} className="w-full bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 mt-4 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)]">
                  {isSubmitting ? 'Sending Request...' : 'Request Custom Quote'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-background-secondary p-8 rounded-2xl border border-border-primary shadow-sm flex flex-col items-center text-center transition-theme">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 transition-theme">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2 transition-theme">Secure Checkout</h3>
              <p className="text-text-secondary mb-8 transition-theme">You will be securely redirected to Stripe to complete your recurring subscription.</p>
              
              <button 
                onClick={() => handleCheckout()} 
                disabled={isCartEmpty || isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-text-primary hover:opacity-90 text-background-primary px-8 py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 shadow-md"
              >
                <Lock className="w-5 h-5" />
                {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
              </button>
              
              <div className="mt-6 flex items-center gap-4 text-text-secondary transition-theme">
                <span>Powered by</span>
                <span className="font-bold text-text-primary text-lg tracking-tight transition-theme">stripe</span>
              </div>
            </div>
          )}

          <div className="pt-8">
            <button 
              onClick={prevStep}
              className="px-6 py-4 rounded-xl text-text-secondary font-semibold hover:bg-background-surface transition-theme flex items-center gap-2 mx-auto sm:mx-0"
            ><ArrowLeft className="w-5 h-5" /> Back to Infrastructure</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};