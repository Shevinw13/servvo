'use client';

import { useState } from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useBrandConfig } from '@/hooks/useBrandConfig';
import { Upload } from 'lucide-react';

interface LogoUploadStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function LogoUploadStep({ onNext, onBack }: LogoUploadStepProps) {
  const { data, setStepData } = useOnboarding();
  const { setLogo } = useBrandConfig();
  const [preview, setPreview] = useState<string | null>(data.logo || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      setStepData({ logo: result });
      setLogo(result);
    };
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="mx-auto max-w-md">
      <h2 className="mb-2 text-2xl font-bold text-foreground">Upload your logo</h2>
      <p className="mb-6 text-muted-foreground">
        Your logo will appear throughout the customer app. You can skip this and add it later.
      </p>

      <label className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 p-12 transition-colors hover:border-primary/50 hover:bg-muted/50">
        {preview ? (
          <img src={preview} alt="Logo preview" className="h-24 w-24 rounded-lg object-contain" />
        ) : (
          <>
            <Upload className="mb-3 h-10 w-10 text-muted-foreground group-hover:text-primary" />
            <p className="text-sm font-medium text-foreground">Drop your logo here or click to browse</p>
            <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, SVG up to 5MB</p>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

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
          {preview ? 'Continue' : 'Skip for now'}
        </button>
      </div>
    </div>
  );
}
