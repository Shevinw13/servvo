'use client';

import { PageTransition } from '@/components/shared/PageTransition';
import { AnimatedCard } from '@/components/shared/AnimatedCard';
import { useBrandConfig } from '@/hooks/useBrandConfig';
import { MOCK_ANALYTICS_METRICS } from '@/data/mockAnalytics';
import { MOCK_CUSTOMERS } from '@/data/mockCustomers';
import { Palette, Users, BarChart3, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const quickLinks = [
  { label: 'Branding Studio', description: 'Customize your brand identity', icon: Palette, href: '/branding' },
  { label: 'Customers', description: 'Manage your customer base', icon: Users, href: '/customers' },
  { label: 'Analytics', description: 'View performance metrics', icon: BarChart3, href: '/analytics' },
  { label: 'Customer Experience', description: 'Configure messaging & tone', icon: MessageSquare, href: '/customer-experience' },
];

export default function DashboardPage() {
  const { config } = useBrandConfig();
  const metrics = MOCK_ANALYTICS_METRICS;
  const activeCustomers = MOCK_CUSTOMERS.filter((c) => c.engagementStatus === 'active').length;

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back{config.businessName ? `, ${config.businessName}` : ''}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here&apos;s an overview of your business performance
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatedCard delay={0}>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">Total Customers</p>
              <p className="mt-1 text-3xl font-bold text-foreground">{metrics.totalCustomers}</p>
            </div>
          </AnimatedCard>
          <AnimatedCard delay={0.1}>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">Active Customers</p>
              <p className="mt-1 text-3xl font-bold text-foreground">{activeCustomers}</p>
            </div>
          </AnimatedCard>
          <AnimatedCard delay={0.2}>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">Repeat Booking Rate</p>
              <p className="mt-1 text-3xl font-bold text-foreground">{metrics.repeatBookingRate}%</p>
            </div>
          </AnimatedCard>
          <AnimatedCard delay={0.3}>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">Avg Rating</p>
              <p className="mt-1 text-3xl font-bold text-foreground">{metrics.averageReviewRating}</p>
            </div>
          </AnimatedCard>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((link, i) => (
              <AnimatedCard key={link.href} delay={0.1 * i + 0.4}>
                <Link
                  href={link.href}
                  className="group block rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <link.icon className="h-8 w-8 text-primary" />
                  <h3 className="mt-3 font-semibold text-foreground group-hover:text-primary">
                    {link.label}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{link.description}</p>
                </Link>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
