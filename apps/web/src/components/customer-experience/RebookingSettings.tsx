'use client';

interface RebookingSettingsProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function RebookingSettings({ enabled, onToggle }: RebookingSettingsProps) {
  return (
    <div>
      <h3 className="mb-1 text-lg font-semibold text-foreground">Rebooking Suggestions</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Proactively suggest rebooking to customers who haven&apos;t scheduled their next service
      </p>
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">Auto Rebooking Suggestions</p>
            <p className="text-sm text-muted-foreground">
              Notify customers when it&apos;s time to book their next service
            </p>
          </div>
          <button
            onClick={() => onToggle(!enabled)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              enabled ? 'bg-primary' : 'bg-muted'
            }`}
            role="switch"
            aria-checked={enabled}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
