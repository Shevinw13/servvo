'use client';

import { useState } from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useBrandConfig } from '@/hooks/useBrandConfig';

interface BusinessInfoStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function BusinessInfoStep({ onNext, onBack }: BusinessInfoStepProps) {
  const { data, setStepData } = useOnboarding();
  const { setBusinessInfo } = useBrandConfig();

  const [name, setName] = useState(data.businessName || '');
  const [phone, setPhone] = useState(data.phone || '');
  const [email, setEmail] = useState(data.email || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Business name is required';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email format';
    if (!phone.trim()) errs.phone = 'Phone is required';
    else if (!/^[\d\s\-\(\)\+]+$/.test(phone)) errs.phone = 'Invalid phone format';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    setStepData({ businessName: name, phone, email });
    setBusinessInfo(name, phone, email);
    onNext();
  };

  return (
    <div className="mx-auto max-w-md">
      <h2 className="mb-2 text-2xl font-bold text-foreground">Tell us about your business</h2>
      <p className="mb-6 text-muted-foreground">This information will appear in your branded app.</p>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Business Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Green Valley Lawn Care"
            className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 123-4567"
            className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hello@yourbusiness.com"
            className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
