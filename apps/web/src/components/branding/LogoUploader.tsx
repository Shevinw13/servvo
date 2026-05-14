'use client';

import { Upload } from 'lucide-react';

interface LogoUploaderProps {
  currentLogo: string | null;
  onUpload: (dataUrl: string) => void;
}

export function LogoUploader({ currentLogo, onUpload }: LogoUploaderProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onload = () => {
      onUpload(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground">Logo</label>
      <label className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 p-6 transition-colors hover:border-primary/50">
        {currentLogo ? (
          <img src={currentLogo} alt="Logo" className="h-12 w-12 rounded-lg object-contain" />
        ) : (
          <>
            <Upload className="mb-1 h-6 w-6 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Upload logo</p>
          </>
        )}
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </label>
    </div>
  );
}
