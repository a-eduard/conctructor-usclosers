"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BookDemoPage() {
  const router = useRouter();
  const calendlyUrl = 'https://calendly.com/team-usclosers/30min';

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.event && e.data.event === 'calendly.event_scheduled') {
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [router]);

  return (
    <div className="flex-1 w-full bg-background-primary flex flex-col pt-12 pb-24 min-h-screen transition-theme">
      <div className="max-w-6xl mx-auto w-full px-4 mb-8 text-center pt-20">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-text-primary transition-theme">
          Schedule your platform demo
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto transition-theme">
          See exactly how US Closers can automate your sales process and deploy trained professionals for your specific niche.
        </p>
      </div>
      <div className="flex-1 w-full max-w-5xl mx-auto bg-background-secondary rounded-2xl shadow-xl border border-border-primary overflow-hidden min-h-[700px] transition-theme">
        <iframe
          src={`${calendlyUrl}?hide_landing_page_details=1&hide_gdpr_banner=1`}
          width="100%"
          height="100%"
          frameBorder="0"
          className="w-full h-full min-h-[700px]"
          title="Calendly Scheduling Page"
        ></iframe>
      </div>
    </div>
  );
}