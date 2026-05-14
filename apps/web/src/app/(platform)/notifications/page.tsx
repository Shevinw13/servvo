'use client';

import { PageTransition } from '@/components/shared/PageTransition';
import { AnimatedCard } from '@/components/shared/AnimatedCard';
import { useBrandConfig } from '@/hooks/useBrandConfig';
import { Bell, Clock, RefreshCw, Star } from 'lucide-react';

export default function NotificationsPage() {
  const { config } = useBrandConfig();
  const { notifications } = config;

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your notification preferences and templates
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatedCard delay={0}>
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

          <AnimatedCard delay={0.1}>
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

        <AnimatedCard delay={0.3}>
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
