'use client';

interface ReviewRequestSettingsProps {
  enabled: boolean;
  delay: number;
  onToggle: (enabled: boolean) => void;
  onDelayChange: (hours: number) => void;
}

export function ReviewRequestSettings({
  enabled,
  delay,
  onToggle,
  onDelayChange,
}: ReviewRequestSettingsProps) {
  return (
    <div>
      <h3 className="mb-1 text-lg font-semibold text-foreground">Review Requests</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Automatically ask customers for reviews after service completion
      </p>
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">Auto Review Request</p>
            <p className="text-sm text-muted-foreground">
              Send a review request after each completed service
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

        {enabled && (
          <div className="mt-4 border-t border-border pt-4">
            <label className="mb-2 block text-sm font-medium text-foreground">
              Delay after service (hours)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={72}
                value={delay}
                onChange={(e) => onDelayChange(Number(e.target.value))}
                className="w-20 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-sm text-muted-foreground">hours after completion</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
