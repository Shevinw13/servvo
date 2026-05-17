'use client';

import { useState } from 'react';
import { PageTransition } from '@/components/shared/PageTransition';
import { AnimatedCard } from '@/components/shared/AnimatedCard';
import { useBrandConfig } from '@/hooks/useBrandConfig';
import { Bell, Clock, RefreshCw, Star, Send } from 'lucide-react';

const AUDIENCE_OPTIONS = ['All Homeowners', 'Due for Service', 'At-Risk', 'Custom'] as const;
type AudienceOption = typeof AUDIENCE_OPTIONS[number];

export default function NotificationsPage() {
  const { config } = useBrandConfig();
  const { notifications } = config;

  const [audience, setAudience] = useState<AudienceOption>('All Homeowners');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [schedule, setSchedule] = useState<'now' | 'scheduled'>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setTitle('');
    setMessage('');
    setScheduledDate('');
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your notification preferences and reach your homeowners directly
          </p>
        </div>

        {/* Send Promotion Section */}
        <AnimatedCard delay={0}>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Send className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Send Push Notification</h2>
                <p className="text-sm text-muted-foreground">Reach your homeowners instantly</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Audience Selector */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Audience
                </label>
                <div className="flex flex-wrap gap-2">
                  {AUDIENCE_OPTIONS.map((option) => (
                    <button
                      key={option}
                      onClick={() => setAudience(option)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                        audience === option
                          ? 'bg-primary text-white'
                          : 'bg-muted/50 text-foreground hover:bg-muted'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Spring Special — 20% Off"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your notification message..."
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Schedule
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="schedule"
                      checked={schedule === 'now'}
                      onChange={() => setSchedule('now')}
                      className="h-4 w-4 text-primary accent-primary"
                    />
                    <span className="text-sm text-foreground">Send Now</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="schedule"
                      checked={schedule === 'scheduled'}
                      onChange={() => setSchedule('scheduled')}
                      className="h-4 w-4 text-primary accent-primary"
                    />
                    <span className="text-sm text-foreground">Schedule</span>
                  </label>
                  {schedule === 'scheduled' && (
                    <input
                      type="datetime-local"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  )}
                </div>
              </div>

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={!title.trim() || !message.trim()}
                className={`w-full rounded-xl py-3.5 text-sm font-semibold transition-all ${
                  sent
                    ? 'bg-green-600 text-white'
                    : !title.trim() || !message.trim()
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary/90 shadow-sm'
                }`}
              >
                {sent ? '✓ Notification Sent!' : 'Send Push Notification'}
              </button>
            </div>
          </div>
        </AnimatedCard>

        {/* Existing notification cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatedCard delay={0.1}>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Templates</p>
                  <p className="text-sm text-muted-foreground">
                    {notifications.templates.length} active templates
                  </p>
                </div>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.15}>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Review Requests</p>
                  <p className="text-sm text-muted-foreground">
                    {notifications.autoReviewRequest ? 'Enabled' : 'Disabled'} — {notifications.reviewRequestDelay}h delay
                  </p>
                </div>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.2}>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <RefreshCw className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Auto Rebooking</p>
                  <p className="text-sm text-muted-foreground">
                    {notifications.autoRebooking ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>

        <AnimatedCard delay={0.25}>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Messaging Tone</h2>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Current tone: <span className="font-medium capitalize text-foreground">{config.messagingTone}</span>
              </p>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </PageTransition>
  );
}
