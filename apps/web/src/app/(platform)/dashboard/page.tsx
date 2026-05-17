'use client';

import { useState } from 'react';
import { PageTransition } from '@/components/shared/PageTransition';
import { AnimatedCard } from '@/components/shared/AnimatedCard';
import { MobilePreview } from '@/components/preview/MobilePreview';
import { useBrandConfig } from '@/hooks/useBrandConfig';
import { useCRMConnections } from '@/hooks/useCRMConnections';
import { MOCK_CRM_INTEGRATIONS } from '@/data/mockCRMIntegrations';
import {
  Users,
  RefreshCw,
  DollarSign,
  Bell,
  Star,
  CheckCircle,
  Camera,
  MessageCircle,
  Calendar,
  CreditCard,
  X,
} from 'lucide-react';

// --- Mock data for intelligence card modals ---
const INTELLIGENCE_SEGMENTS = {
  dueForService: {
    title: 'Due for Service',
    action: 'Send Reminder',
    homeowners: [
      { id: '1', name: 'Jennifer Adams', lastService: '8 weeks ago' },
      { id: '2', name: 'Lisa Patel', lastService: '6 weeks ago' },
      { id: '3', name: "Brian O'Connor", lastService: '9 weeks ago' },
      { id: '4', name: 'Kevin Murphy', lastService: '12 weeks ago' },
    ],
  },
  pendingReviews: {
    title: 'Pending Reviews',
    action: 'Request Review',
    homeowners: [
      { id: '1', name: 'Sarah Mitchell', lastService: '2 days ago' },
      { id: '2', name: 'Marcus Williams', lastService: '3 days ago' },
      { id: '3', name: 'David Nguyen', lastService: '1 day ago' },
    ],
  },
  upsellOpportunities: {
    title: 'Upsell Opportunities',
    action: 'Send Promotion',
    homeowners: [
      { id: '1', name: 'Robert Chen', lastService: 'Lawn only — suggest fertilization' },
      { id: '2', name: 'Thomas Garcia', lastService: 'Basic plan — suggest premium' },
      { id: '3', name: 'Rachel Kim', lastService: 'Mowing only — suggest edging' },
      { id: '4', name: 'Emily Rodriguez', lastService: 'No seasonal package' },
    ],
  },
  atRisk: {
    title: 'At-Risk Homeowners',
    action: 'Send Re-engagement',
    homeowners: [
      { id: '1', name: 'Amanda Foster', lastService: '4 months ago' },
      { id: '2', name: 'Kevin Murphy', lastService: '3 months ago' },
      { id: '3', name: 'Lisa Patel', lastService: 'Declining engagement' },
    ],
  },
};

type SegmentKey = keyof typeof INTELLIGENCE_SEGMENTS;

export default function DashboardPage() {
  const { config } = useBrandConfig();
  const { isConnected } = useCRMConnections();
  const [activeModal, setActiveModal] = useState<SegmentKey | null>(null);
  const [sentActions, setSentActions] = useState<Record<string, boolean>>({});

  const handleSendIndividual = (segmentKey: SegmentKey, homeownerId: string) => {
    setSentActions((prev) => ({ ...prev, [`${segmentKey}-${homeownerId}`]: true }));
  };

  const handleSendAll = (segmentKey: SegmentKey) => {
    const segment = INTELLIGENCE_SEGMENTS[segmentKey];
    const updates: Record<string, boolean> = {};
    segment.homeowners.forEach((h) => {
      updates[`${segmentKey}-${h.id}`] = true;
    });
    setSentActions((prev) => ({ ...prev, ...updates }));
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {config.businessName ? `${config.businessName}` : 'Your Business'}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Homeowner relationship intelligence
          </p>
        </div>

        {/* KPI Metrics Row */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <AnimatedCard delay={0}>
            <MetricTile
              icon={Users}
              label="Active Homeowners"
              value="156"
              trend="+12%"
            />
          </AnimatedCard>
          <AnimatedCard delay={0.05}>
            <MetricTile
              icon={RefreshCw}
              label="Rebooking Rate"
              value="78%"
              trend="+5%"
            />
          </AnimatedCard>
          <AnimatedCard delay={0.1}>
            <MetricTile
              icon={DollarSign}
              label="Avg Revenue/Homeowner"
              value="$420"
            />
          </AnimatedCard>
          <AnimatedCard delay={0.15}>
            <MetricTile
              icon={Bell}
              label="Push Open Rate"
              value="64%"
              trend="+8%"
            />
          </AnimatedCard>
        </div>

        {/* Main Content */}
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

          {/* Right Column */}
          <div className="space-y-6 xl:col-span-2">
            {/* Homeowner Intelligence — Clickable Cards */}
            <AnimatedCard delay={0.25}>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Homeowner Intelligence
                </h2>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                  <IntelligenceCard
                    label="Due for Service"
                    value="23"
                    subtitle="homeowners"
                    onClick={() => setActiveModal('dueForService')}
                    actionable
                  />
                  <IntelligenceCard
                    label="Pending Reviews"
                    value="8"
                    subtitle="homeowners"
                    onClick={() => setActiveModal('pendingReviews')}
                    actionable
                  />
                  <IntelligenceCard
                    label="Upsell Opportunities"
                    value="14"
                    subtitle="homeowners"
                    onClick={() => setActiveModal('upsellOpportunities')}
                    actionable
                  />
                  <IntelligenceCard
                    label="At-Risk Homeowners"
                    value="5"
                    subtitle="homeowners"
                    onClick={() => setActiveModal('atRisk')}
                    actionable
                    variant="warning"
                  />
                  <IntelligenceCard
                    label="Response Time"
                    value="12 min"
                    subtitle="avg"
                  />
                  <IntelligenceCard
                    label="Google Review Rate"
                    value="72%"
                  />
                </div>
              </div>
            </AnimatedCard>

            {/* Recent Activity */}
            <AnimatedCard delay={0.3}>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Recent Activity
                </h2>
                <div className="space-y-3">
                  <ActivityRow icon={CheckCircle} text="Service completed — Sarah M." time="2h ago" color="text-green-600" />
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

      {/* Intelligence Modal */}
      {activeModal && (
        <IntelligenceModal
          segmentKey={activeModal}
          segment={INTELLIGENCE_SEGMENTS[activeModal]}
          sentActions={sentActions}
          onSendIndividual={handleSendIndividual}
          onSendAll={handleSendAll}
          onClose={() => setActiveModal(null)}
        />
      )}
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

function IntelligenceCard({ label, value, subtitle, onClick, actionable, variant }: {
  label: string;
  value: string;
  subtitle?: string;
  onClick?: () => void;
  actionable?: boolean;
  variant?: 'warning';
}) {
  const baseClasses = 'rounded-lg p-4 transition-all duration-150';
  const interactiveClasses = actionable
    ? 'cursor-pointer hover:ring-2 hover:ring-primary/30 hover:shadow-md active:scale-[0.98]'
    : '';
  const bgClass = variant === 'warning' ? 'bg-amber-50 dark:bg-amber-950/20' : 'bg-muted/50';

  return (
    <div
      className={`${baseClasses} ${bgClass} ${interactiveClasses}`}
      onClick={onClick}
      role={actionable ? 'button' : undefined}
      tabIndex={actionable ? 0 : undefined}
      onKeyDown={actionable ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); } : undefined}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-baseline gap-1.5">
        <p className="text-lg font-semibold text-foreground">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {actionable && (
        <p className="mt-2 text-xs font-medium text-primary">Click to take action →</p>
      )}
    </div>
  );
}

function IntelligenceModal({ segmentKey, segment, sentActions, onSendIndividual, onSendAll, onClose }: {
  segmentKey: SegmentKey;
  segment: typeof INTELLIGENCE_SEGMENTS[SegmentKey];
  sentActions: Record<string, boolean>;
  onSendIndividual: (segmentKey: SegmentKey, homeownerId: string) => void;
  onSendAll: (segmentKey: SegmentKey) => void;
  onClose: () => void;
}) {
  const allSent = segment.homeowners.every((h) => sentActions[`${segmentKey}-${h.id}`]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{segment.title}</h3>
            <p className="text-sm text-muted-foreground">{segment.homeowners.length} homeowners</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Homeowner List */}
        <div className="space-y-3 mb-5">
          {segment.homeowners.map((homeowner) => {
            const isSent = sentActions[`${segmentKey}-${homeowner.id}`];
            return (
              <div
                key={homeowner.id}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{homeowner.name}</p>
                  <p className="text-xs text-muted-foreground">{homeowner.lastService}</p>
                </div>
                <button
                  onClick={() => onSendIndividual(segmentKey, homeowner.id)}
                  disabled={isSent}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    isSent
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                >
                  {isSent ? '✓ Sent' : 'Send'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Bulk Action */}
        <button
          onClick={() => onSendAll(segmentKey)}
          disabled={allSent}
          className={`w-full rounded-xl py-3 text-sm font-semibold transition-colors ${
            allSent
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-primary text-white hover:bg-primary/90'
          }`}
        >
          {allSent ? '✓ All Sent' : `${segment.action} — Send to All`}
        </button>
      </div>
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
