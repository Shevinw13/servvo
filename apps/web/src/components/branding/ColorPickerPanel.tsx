'use client';

import { isValidHex } from '@/lib/colorUtils';
import { cn } from '@/lib/utils';

interface ColorPickerPanelProps {
  label: string;
  value: string;
  presets: string[];
  onChange: (color: string) => void;
}

export function ColorPickerPanel({ label, value, presets, onChange }: ColorPickerPanelProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground">{label}</label>
      <div className="flex items-center gap-3">
        <div
          className="h-9 w-9 rounded-lg border border-border"
          style={{ backgroundColor: isValidHex(value) ? value : '#ccc' }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-28 rounded-lg border border-border bg-card px-3 py-2 text-sm font-mono text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {presets.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={cn(
              'h-6 w-6 rounded-md border-2 transition-all',
              value === color ? 'border-foreground scale-110' : 'border-transparent hover:scale-105'
            )}
            style={{ backgroundColor: color }}
            aria-label={`Select ${color}`}
          />
        ))}
      </div>
    </div>
  );
}
