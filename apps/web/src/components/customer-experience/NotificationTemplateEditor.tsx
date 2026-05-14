'use client';

import { NotificationTemplate } from '@/types/brand';
import { cn } from '@/lib/utils';

interface NotificationTemplateEditorProps {
  templates: NotificationTemplate[];
  onChange: (templates: NotificationTemplate[]) => void;
}

const TYPE_LABELS: Record<string, string> = {
  appointment_confirmation: 'Appointment Confirmation',
  service_in_progress: 'Service In Progress',
  service_complete: 'Service Complete',
  review_request: 'Review Request',
};

export function NotificationTemplateEditor({ templates, onChange }: NotificationTemplateEditorProps) {
  const handleBodyChange = (id: string, body: string) => {
    const updated = templates.map((t) => (t.id === id ? { ...t, body } : t));
    onChange(updated);
  };

  const handleSubjectChange = (id: string, subject: string) => {
    const updated = templates.map((t) => (t.id === id ? { ...t, subject } : t));
    onChange(updated);
  };

  return (
    <div>
      <h3 className="mb-1 text-lg font-semibold text-foreground">Notification Templates</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Customize the messages your customers receive at each stage
      </p>
      <div className="space-y-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <p className="mb-3 text-sm font-medium text-primary">
              {TYPE_LABELS[template.type] || template.type}
            </p>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Subject
                </label>
                <input
                  type="text"
                  value={template.subject}
                  onChange={(e) => handleSubjectChange(template.id, e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Message Body
                </label>
                <textarea
                  value={template.body}
                  onChange={(e) => handleBodyChange(template.id, e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
