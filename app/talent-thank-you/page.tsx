"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TalentThankYouPage() {
  useEffect(() => {
    // Optionally fire GA4 event for lead conversion
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        send_to: 'AW-CONVERSION_ID/LABEL', // Replace with real ID
        value: 1.0,
        currency: 'USD'
      });
    }
  }, []);

  return (
    <div className="bg-background-primary text-text-primary font-sans selection:bg-blue-500/30 py-12 px-4 sm:px-6 lg:px-8 min-h-screen transition-theme">
      <div className="max-w-4xl mx-auto pt-16">
        <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Homepage
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 transition-theme">
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-text-primary transition-theme">Request Received!</h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto transition-theme">
            Your request is being processed. To get immediate access to candidate profiles and discuss your exact requirements, <span className="text-text-primary font-bold transition-theme">book a 15-minute qualification call below.</span>
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-background-secondary rounded-3xl overflow-hidden border border-border-primary shadow-2xl h-[700px] relative transition-theme"
        >
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          {/* Using a placeholder calendly for demonstration */}
          <iframe 
            src="https://calendly.com/usclosers/15min" 
            width="100%" 
            height="100%" 
            frameBorder="0"
            title="Book a qualification call"
            className="relative z-10"
            onClick={() => {
              if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'click', { event_category: 'calendar', event_label: 'book_call_widget' });
              }
            }}
          ></iframe>
        </motion.div>
      </div>
    </div>
  );
}