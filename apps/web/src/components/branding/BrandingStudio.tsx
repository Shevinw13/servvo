'use client';

import { useBrandConfig } from '@/hooks/useBrandConfig';
import { MobilePreview } from '@/components/preview/MobilePreview';
import { ColorPickerPanel } from './ColorPickerPanel';
import { TypographySelector } from './TypographySelector';
import { ImagerySelector } from './ImagerySelector';
import { TerminologySelector } from './TerminologySelector';
import { ToneSelector } from './ToneSelector';
import { LogoUploader } from './LogoUploader';
import { isValidHex } from '@/lib/colorUtils';

const PRESET_COLORS = [
  '#2D4A2D', '#1B5E20', '#0D47A1', '#4A148C',
  '#BF360C', '#E65100', '#F57F17', '#1A237E',
  '#004D40', '#263238', '#3E2723', '#880E4F',
];

export function BrandingStudio() {
  const {
    config,
    setLogo,
    setColors,
    setTypography,
    setImageryStyle,
    setTerminology,
    setMessagingTone,
  } = useBrandConfig();

  const handlePrimaryChange = (color: string) => {
    if (isValidHex(color)) {
      setColors(color, config.colors.accent);
    }
  };

  const handleAccentChange = (color: string) => {
    if (isValidHex(color)) {
      setColors(config.colors.primary, color);
    }
  };

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Left: Editing Panel */}
      <div className="flex-1 space-y-8">
        <LogoUploader currentLogo={config.logo} onUpload={setLogo} />

        <div className="space-y-6">
          <ColorPickerPanel
            label="Primary Color"
            value={config.colors.primary}
            presets={PRESET_COLORS}
            onChange={handlePrimaryChange}
          />
          <ColorPickerPanel
            label="Accent Color"
            value={config.colors.accent}
            presets={PRESET_COLORS}
            onChange={handleAccentChange}
          />
        </div>

        <TypographySelector
          value={config.typography.fontPairingId}
          onChange={setTypography}
        />

        <ImagerySelector
          value={config.imageryStyle}
          onChange={setImageryStyle}
        />

        <TerminologySelector
          value={config.terminology}
          onChange={setTerminology}
        />

        <ToneSelector
          value={config.messagingTone}
          onChange={setMessagingTone}
        />
      </div>

      {/* Right: Mobile Preview */}
      <div className="flex justify-center lg:sticky lg:top-24 lg:self-start">
        <MobilePreview />
      </div>
    </div>
  );
}
