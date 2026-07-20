import React from 'react';
import { Link } from 'react-router-dom';

export default function PricingPage() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-12 px-container-padding-mobile md:px-container-padding-desktop">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full surface-glass w-fit border-glow mb-6">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="font-label-mono text-label-mono text-primary uppercase tracking-widest">Pricing</span>
        </div>
        <h1 className="font-display-lg text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-br from-on-surface to-primary leading-tight mb-4">
          Intelligent Pricing for Industrial Scale
        </h1>
        <p className="font-body-base text-on-surface-variant max-w-2xl mx-auto">
          Choose the tier that matches your operational needs. All plans include standard AI models and real-time dashboard analytics.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto w-full">
        {/* Starter Plan */}
        <div className="surface-glass p-8 rounded-xl flex flex-col border border-outline-variant/30 hover:border-primary/50 transition-colors">
          <div className="mb-8">
            <h3 className="font-headline-md text-2xl text-on-surface mb-2">Starter</h3>
            <p className="font-body-sm text-on-surface-variant">For small clusters initiating digital transformation.</p>
          </div>
          <div className="mb-8">
            <span className="font-display-lg text-5xl text-primary font-bold">$99</span>
            <span className="font-body-base text-on-surface-variant"> /month</span>
          </div>
          <ul className="flex flex-col gap-4 mb-8 flex-1">
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-body-base text-on-surface">Up to 3 Factories</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-body-base text-on-surface">Basic AI Analytics</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-body-base text-on-surface">Standard Support</span>
            </li>
          </ul>
          <Link to="/signup" className="w-full text-center surface-glass border-glow text-on-surface font-bold px-6 py-3 rounded-lg hover:bg-primary/10 transition-all duration-300">
            Get Started
          </Link>
        </div>

        {/* Professional Plan (Highlighted) */}
        <div className="surface-glass p-8 rounded-xl flex flex-col border border-primary relative overflow-hidden transform md:-translate-y-4 shadow-[0_0_30px_rgba(107,216,203,0.15)]">
          <div className="absolute top-0 left-0 w-full h-1 primary-gradient"></div>
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-headline-md text-2xl text-on-surface">Professional</h3>
              <span className="font-label-mono text-xs uppercase tracking-widest text-background bg-primary px-2 py-1 rounded">Most Popular</span>
            </div>
            <p className="font-body-sm text-on-surface-variant">Advanced insights for medium-scale manufacturing operations.</p>
          </div>
          <div className="mb-8">
            <span className="font-display-lg text-5xl text-primary font-bold">$299</span>
            <span className="font-body-base text-on-surface-variant"> /month</span>
          </div>
          <ul className="flex flex-col gap-4 mb-8 flex-1">
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-body-base text-on-surface">Up to 15 Factories</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-body-base text-on-surface">Predictive Maintenance AI</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-body-base text-on-surface">Priority Support</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-body-base text-on-surface">Full Digital Twin Features</span>
            </li>
          </ul>
          <Link to="/signup" className="w-full text-center primary-gradient text-white font-bold px-6 py-3 rounded-lg hover:shadow-[0_0_15px_rgba(107,216,203,0.6)] transition-all duration-300">
            Start Free Trial
          </Link>
        </div>

        {/* Enterprise Plan */}
        <div className="surface-glass p-8 rounded-xl flex flex-col border border-outline-variant/30 hover:border-primary/50 transition-colors">
          <div className="mb-8">
            <h3 className="font-headline-md text-2xl text-on-surface mb-2">Enterprise</h3>
            <p className="font-body-sm text-on-surface-variant">Custom scale deployments for large industrial conglomerates.</p>
          </div>
          <div className="mb-8 flex items-center h-[56px]">
            <span className="font-headline-md text-3xl text-on-surface">Custom Pricing</span>
          </div>
          <ul className="flex flex-col gap-4 mb-8 flex-1">
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-body-base text-on-surface">Unlimited Factories</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-body-base text-on-surface">Custom AI Model Training</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-body-base text-on-surface">Dedicated Account Manager</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-body-base text-on-surface">On-Premise Deployment Options</span>
            </li>
          </ul>
          <Link to="/settings" className="w-full text-center surface-glass border-glow text-on-surface font-bold px-6 py-3 rounded-lg hover:bg-primary/10 transition-all duration-300">
            Contact Sales
          </Link>
        </div>
      </div>
    </div>
  );
}
