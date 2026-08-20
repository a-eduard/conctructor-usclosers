"use client";

import React, { useEffect, useState } from 'react';
import { CheckCircle2, ArrowLeft, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function EnterpriseSquadBuilderThankYouPage() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Try to get email from session storage to pre-fill calendar
    const savedEmail = sessionStorage.getItem('leadEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background-primary flex flex-col items-center pt-24 pb-12 px-6 transition-theme">
      <div className="max-w-3xl w-full">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-500/20 mb-6 transition-theme">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-text-primary mb-4 transition-theme">
            Brief Request Received
          </h1>
          <p className="text-lg text-text-secondary transition-theme">
            We&apos;ve received your request for the Enterprise Squad Builder. To complete your division design brief and align on timeline specifics, please select a convenient time for an introductory call with our Enterprise architect.
          </p>
        </div>

        {/* Calendar Widget */}
        <div className="bg-background-secondary rounded-3xl shadow-xl border border-border-primary overflow-hidden mb-12 transition-theme">
          <div className="p-4 bg-background-surface border-b border-border-primary text-text-primary flex items-center gap-3 transition-theme">
            <Calendar className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <span className="font-semibold">Schedule Architecture Consultation</span>
          </div>
          <div className="w-full h-[600px] bg-background-primary relative transition-theme">
            {/* 
              This is a standard iframe embed for Cal.com or Calendly. 
              We append the email to pre-fill the form.
              Replace the src with your actual booking link.
            */}
            <iframe 
              src={`https://cal.com/meet/30min?email=${encodeURIComponent(email)}&layout=month_view`}
              width="100%" 
              height="100%" 
              frameBorder="0"
              title="Schedule a call"
              className="absolute inset-0"
            ></iframe>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}