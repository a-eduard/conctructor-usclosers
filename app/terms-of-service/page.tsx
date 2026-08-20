"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Scale, FileText, AlertCircle, HelpCircle, CheckCircle } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-background-primary transition-theme">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Header */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-3xl mb-8 transition-theme">
              <Scale className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary mb-6 transition-theme">
              Terms of Service
            </h1>
            <p className="text-lg text-text-secondary transition-theme">
              Last Updated: July 7, 2026
            </p>
          </div>

          <div className="w-full h-px bg-border-primary transition-theme" />

          {/* Content */}
          <div className="space-y-12 text-text-secondary leading-relaxed text-lg transition-theme">
            
            {/* Introduction */}
            <section>
              <p className="mb-6">
                Welcome to USClosers. These Terms of Service (&quot;Terms&quot;) govern your use of our website, applications, and fractional sales services (collectively, the &quot;Services&quot;). By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy.
              </p>
              <p>
                If you disagree with any part of the terms, then you may not access the Service.
              </p>
            </section>

            {/* 1. Services Description */}
            <section className="bg-background-secondary p-8 rounded-3xl shadow-sm border border-border-primary transition-theme">
              <div className="flex items-center gap-4 mb-6">
                <FileText className="w-8 h-8 text-blue-500" />
                <h2 className="text-2xl font-bold text-text-primary transition-theme">1. Description of Services</h2>
              </div>
              <p className="mb-4">
                USClosers provides fractional B2B sales teams, including but not limited to Sales Development Representatives (SDRs), Account Executives (Closers), Scouts, and Sales Operations (SalesOps) infrastructure. 
              </p>
              <ul className="list-disc pl-6 space-y-3 mb-6">
                <li>We reserve the right to withdraw or amend our Service, and any service or material we provide, in our sole discretion without notice.</li>
                <li>We will not be liable if for any reason all or any part of the Service is unavailable at any time or for any period.</li>
                <li>From time to time, we may restrict access to some parts of the Service, or the entire Service, to users, including registered users.</li>
              </ul>
            </section>

            {/* 2. User Responsibilities */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-6 transition-theme">2. User Responsibilities & Account</h2>
              <p className="mb-4">
                When you create an account or request services with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li><strong className="text-text-primary transition-theme">Account Security:</strong> You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.</li>
                <li><strong className="text-text-primary transition-theme">Compliance:</strong> You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
                <li><strong className="text-text-primary transition-theme">Prohibited Uses:</strong> You may use our Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service in any way that violates any applicable national or international law or regulation.</li>
              </ul>
            </section>

            {/* 3. Payments and Subscriptions */}
            <section className="bg-background-secondary p-8 rounded-3xl shadow-sm border border-border-primary transition-theme">
              <div className="flex items-center gap-4 mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
                <h2 className="text-2xl font-bold text-text-primary transition-theme">3. Payments, Subscriptions, and Refunds</h2>
              </div>
              <p className="mb-4">
                Some parts of the Service are billed on a subscription basis (&quot;Subscription(s)&quot;). You will be billed in advance on a recurring and periodic basis (&quot;Billing Cycle&quot;). Billing cycles are set on a regular basis, typically monthly.
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li><strong className="text-text-primary transition-theme">Auto-Renewal:</strong> At the end of each Billing Cycle, your Subscription will automatically renew under the exact same conditions unless you cancel it or USClosers cancels it.</li>
                <li><strong className="text-text-primary transition-theme">Fee Changes:</strong> USClosers, in its sole discretion and at any time, may modify the Subscription fees. Any Subscription fee change will become effective at the end of the then-current Billing Cycle.</li>
                <li><strong className="text-text-primary transition-theme">Refunds:</strong> Except when required by law, paid Subscription fees are non-refundable. Certain refund requests for Subscriptions may be considered by USClosers on a case-by-case basis and granted at the sole discretion of USClosers.</li>
              </ul>
            </section>

            {/* 4. Intellectual Property */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <AlertCircle className="w-8 h-8 text-purple-500" />
                <h2 className="text-2xl font-bold text-text-primary transition-theme">4. Intellectual Property</h2>
              </div>
              <p className="mb-4">
                The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of USClosers and its licensors.
              </p>
              <p>
                Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of USClosers. The materials contained in this website are protected by applicable copyright and trademark law.
              </p>
            </section>

            {/* 5. Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-6 transition-theme">5. Limitation of Liability</h2>
              <p className="mb-4">
                In no event shall USClosers, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>Your access to or use of or inability to access or use the Service;</li>
                <li>Any conduct or content of any third party on the Service;</li>
                <li>Any content obtained from the Service; and</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
              </ul>
            </section>

            {/* 6. Contact Us */}
            <section className="bg-background-secondary p-8 rounded-3xl shadow-sm border border-border-primary transition-theme">
              <div className="flex items-center gap-4 mb-6">
                <HelpCircle className="w-8 h-8 text-orange-500" />
                <h2 className="text-2xl font-bold text-text-primary transition-theme">6. Contact Information</h2>
              </div>
              <p className="mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <p className="font-semibold text-text-primary transition-theme">
                Email: legal@usclosers.com
              </p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}