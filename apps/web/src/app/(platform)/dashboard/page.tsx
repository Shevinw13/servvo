'use client';

import { PageTransition } from '@/components/shared/PageTransition';
import { AnimatedCard } from '@/components/shared/AnimatedCard';
import { MobilePreview } from '@/components/preview/MobilePreview';
import { useBrandConfig } from '@/hooks/useBrandConfig';
import { useCRMConnections } from '@/hooks/useCRMConnections';
import { MOCK_ANALYTICS_METRICS } from '@/data/mockAnalytics';
import { MOCK_CUSTOMERS } from '@/data/mockCustomers';
import { MOCK_CRM_INTEGRATIONS } from '@/data/mockCRMIntegrations';
import {
  Heart,
  RefreshCw,
  Star,
  Smartphone,
  MessageCircle,
  Clock,
  CheckCircle,
  Camera,
  Calendar,
  CreditCard,
  Plug,
} from 'lucide-react';

export default function DashboardPage() {
  const { config } = useBrandConfig();
  const { isConnected } = useCRMConnections();
  const metrics = MOCK_ANALYTICS_METRICS;
  const activeCustomers = MOCK_CUSTOMERS.filter((c) => c.engagementStatus === 'active').length;

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {config.businessName ? `${config.businessName}` : 'Your Business'}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Customer experience intelligence
          </p>
        </div>

        {/* Experience Metrics Row */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <AnimatedCard delay={0}>
            <MetricTile
              icon={Heart}
              label="Homeowner Retention"
              value={`${metrics.retentionRate}%`}
              trend="+8%"
            />
          </AnimatedCard>
          <AnimatedCard delay={0.05}>
            <MetricTile
              icon={RefreshCw}
              label="Repeat Service Rate"
              value={`${metrics.repeatBookingRate}%`}
              trend="+5%"
            />
          </AnimatedCard>
          <AnimatedCard delay={0.1}>
            <MetricTile
              icon={Star}
              label="Experience Score"
              value={`${metrics.averageReviewRating}`}
              trend="+0.2"
            />
          </AnimatedCard>
          <AnimatedCard delay={0.15}>
            <MetricTile
              icon={Smartphone}
              label="App Engagement"
              value={`${metrics.weeklyAppSessions}`}
              subtitle="sessions/week"
            />
          </AnimatedCard>
        </div>

        {/* Main Content: Experience Centerpiece + Intelligence */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Homeowner Experience Centerpiece */}
          <AnimatedCard delay={0.2} className="xl:col-span-1">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Homeowner Experience
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Live preview of your branded app
                </p>
              </div>
              <div className="flex justify-center">
                <div className="scale-[0.65] origin-top">
                  <MobilePreview />
                </div>
              </div>
            </div>
          </AnimatedCard>

          {/* Right Column: Intelligence + Activity */}
          <div className="space-y-6 xl:col-span-2">
            {/* Customer Intelligence */}
            <AnimatedCard delay={0.25}>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Customer Intelligence
                </h2>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                  <InsightCard label="Active Properties" value={`${activeCustomers}`} />
                  <InsightCard label="Avg Response Time" value="12 min" />
                  <InsightCard label="Review Conversion" value="68%" />
                  <InsightCard label="Customer Satisfaction" value="4.8/5" />
                  <InsightCard label="Homeowner Loyalty" value="92%" />
                  <InsightCard label="Communication Health" value="Excellent" />
                </div>
              </div>
            </AnimatedCard>

            {/* Activity & Communication */}
            <AnimatedCard delay={0.3}>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Recent Activity
                </h2>
                <div className="space-y-3">
                  <ActivityRow icon={CheckCircle} text="Lawn service completed — Sarah M." time="2h ago" color="text-green-600" />
                  <ActivityRow icon={Star} text="5-star review received — David K." time="4h ago" color="text-amber-500" />
                  <ActivityRow icon={Camera} text="Provider uploaded service photos" time="5h ago" color="text-blue-500" />
                  <ActivityRow icon={MessageCircle} text="Homeowner message — Jennifer R." time="6h ago" color="text-primary" />
                  <ActivityRow icon={Calendar} text="New appointment confirmed — Mike T." time="8h ago" color="text-primary" />
                  <ActivityRow icon={CreditCard} text="Invoice paid — $85.00" time="1d ago" color="text-green-600" />
                </div>
              </div>
            </AnimatedCard>

            {/* CRM Integration Status */}
            <AnimatedCard delay={0.35}>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Connected Systems
                </h2>
                <div className="flex flex-wrap gap-3">
                  {MOCK_CRM_INTEGRATIONS.map((crm) => (
                    <div
                      key={crm.id}
                      className="flex items-center gap-2 rounded-lg border border-border px-3 py-2"
                    >
                      <div className={`h-2 w-2 rounded-full ${isConnected(crm.id) ? 'bg-green-500' : 'bg-muted-foreground/30'}`} />
                      <span className="text-sm font-medium text-foreground">{crm.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {isConnected(crm.id) ? 'Connected' : 'Not connected'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

// --- Sub-components ---

function MetricTile({ icon: Icon, label, value, trend, subtitle }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  trend?: string;
  subtitle?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-2xl font-semibold text-foreground">{value}</span>
        {trend && (
          <span className="mb-0.5 text-xs font-medium text-green-600">{trend}</span>
        )}
        {subtitle && (
          <span className="mb-0.5 text-xs text-muted-foreground">{subtitle}</span>
        )}
      </div>
    </div>
  );
}

function InsightCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}

function ActivityRow({ icon: Icon, text, time, color }: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  time: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/30">
      <Icon className={`h-4 w-4 shrink-0 ${color}`} />
      <span className="flex-1 text-sm text-foreground">{text}</span>
      <span className="text-xs text-muted-foreground">{time}</span>
    </div>
  );
}
