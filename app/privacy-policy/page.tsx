"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, FileText } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-3xl mb-8 transition-theme">
              <Shield className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary mb-6 transition-theme">
              Privacy Policy
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
                At USClosers (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), we take your privacy seriously. This Privacy Policy outlines how we collect, use, protect, and disclose your personal information when you use our website, applications, and services (collectively, the &quot;Services&quot;). By accessing or using our Services, you agree to the terms of this Privacy Policy.
              </p>
              <p>
                We are committed to maintaining the trust and confidence of our visitors and clients. We do not sell, rent, or trade email lists or data with other companies and businesses for marketing purposes.
              </p>
            </section>

            {/* 1. Information We Collect */}
            <section className="bg-background-secondary p-8 rounded-3xl shadow-sm border border-border-primary transition-theme">
              <div className="flex items-center gap-4 mb-6">
                <Database className="w-8 h-8 text-blue-500" />
                <h2 className="text-2xl font-bold text-text-primary transition-theme">1. Information We Collect</h2>
              </div>
              <p className="mb-4">We collect information to provide better services to our users. The types of information we collect include:</p>
              <ul className="list-disc pl-6 space-y-3 mb-6">
                <li><strong className="text-text-primary transition-theme">Personal Identification Information:</strong> Name, email address, phone number, company name, and job title when you register, book a demo, or request our services.</li>
                <li><strong className="text-text-primary transition-theme">Financial Information:</strong> Billing details and payment information required to process transactions. This data is securely processed by our payment gateways (e.g., Stripe) and is not stored directly on our servers.</li>
                <li><strong className="text-text-primary transition-theme">Usage Data:</strong> Information on how the Services are accessed and used. This may include your computer&apos;s Internet Protocol (IP) address, browser type, browser version, the pages of our Services that you visit, the time and date of your visit, and other diagnostic data.</li>
                <li><strong className="text-text-primary transition-theme">Communication Data:</strong> Records of communications when you contact our support team, participate in surveys, or engage with our chatbots.</li>
              </ul>
            </section>

            {/* 2. How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-6 transition-theme">2. How We Use Your Information</h2>
              <p className="mb-4">The information we collect is used in the following ways:</p>
              <ul className="list-disc pl-6 space-y-3">
                <li><strong className="text-text-primary transition-theme">Service Delivery:</strong> To provide and maintain our Services, process transactions, and send related information including confirmations and invoices.</li>
                <li><strong className="text-text-primary transition-theme">Personalization:</strong> To understand and analyze how you use our Services and what products or services are most relevant to you.</li>
                <li><strong className="text-text-primary transition-theme">Communication:</strong> To communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes.</li>
                <li><strong className="text-text-primary transition-theme">Security & Compliance:</strong> To detect, prevent, and address technical issues, fraud, or other illegal activities, and to enforce our Terms of Service.</li>
              </ul>
            </section>

            {/* 3. Information Protection */}
            <section className="bg-background-secondary p-8 rounded-3xl shadow-sm border border-border-primary transition-theme">
              <div className="flex items-center gap-4 mb-6">
                <Lock className="w-8 h-8 text-emerald-500" />
                <h2 className="text-2xl font-bold text-text-primary transition-theme">3. Data Security & Protection</h2>
              </div>
              <p className="mb-4">
                The security of your data is paramount to us. We implement a variety of industry-standard security measures to maintain the safety of your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>All data is transmitted via Secure Socket Layer (SSL) technology.</li>
                <li>Payment information is encrypted and routed directly to our compliant payment gateway providers.</li>
                <li>Access to personal data is strictly limited to authorized employees, contractors, and agents who need to know that information in order to process it for us, and who are subject to strict contractual confidentiality obligations.</li>
                <li>Regular vulnerability scanning and penetration testing of our infrastructure.</li>
              </ul>
            </section>

            {/* 4. Cookies and Tracking */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <Eye className="w-8 h-8 text-purple-500" />
                <h2 className="text-2xl font-bold text-text-primary transition-theme">4. Cookies and Tracking Technologies</h2>
              </div>
              <p className="mb-4">
                We use cookies and similar tracking technologies to track the activity on our Services and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
              </p>
              <p>
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Services. Examples of Cookies we use include Session Cookies (to operate our Service), Preference Cookies (to remember your preferences), and Security Cookies (for security purposes).
              </p>
            </section>

            {/* 5. Third-Party Disclosure */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-6 transition-theme">5. Third-Party Disclosure</h2>
              <p className="mb-4">
                We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your consent, except in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li><strong className="text-text-primary transition-theme">Service Providers:</strong> We may employ third-party companies and individuals to facilitate our Service, provide the Service on our behalf, perform Service-related services, or assist us in analyzing how our Service is used.</li>
                <li><strong className="text-text-primary transition-theme">Legal Requirements:</strong> We may disclose your Personal Data in the good faith belief that such action is necessary to comply with a legal obligation, protect and defend our rights or property, prevent or investigate possible wrongdoing in connection with the Service, or protect the personal safety of users.</li>
              </ul>
            </section>

            {/* 6. Your Rights */}
            <section className="bg-background-secondary p-8 rounded-3xl shadow-sm border border-border-primary transition-theme">
              <div className="flex items-center gap-4 mb-6">
                <FileText className="w-8 h-8 text-orange-500" />
                <h2 className="text-2xl font-bold text-text-primary transition-theme">6. Your Data Protection Rights</h2>
              </div>
              <p className="mb-4">
                Depending on your location (such as under the GDPR or CCPA), you may have the following rights regarding your personal data:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>The right to access, update, or delete the information we have on you.</li>
                <li>The right of rectification if your information is inaccurate or incomplete.</li>
                <li>The right to object to our processing of your Personal Data.</li>
                <li>The right of restriction, requesting that we restrict the processing of your personal information.</li>
                <li>The right to data portability, requesting a copy of the information we have on you in a structured, machine-readable format.</li>
              </ul>
              <p className="mt-6">
                To exercise any of these rights, please contact our Data Protection Officer at privacy@usclosers.com.
              </p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}