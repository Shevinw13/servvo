'use client';

import { PageTransition } from '@/components/shared/PageTransition';
import { AnimatedCard } from '@/components/shared/AnimatedCard';
import { MetricCard } from '@/components/analytics/MetricCard';
import { EngagementChart } from '@/components/analytics/EngagementChart';
import { BookingsChart } from '@/components/analytics/BookingsChart';
import {
  MOCK_ANALYTICS_METRICS,
  MOCK_ENGAGEMENT_DATA,
  MOCK_BOOKINGS_DATA,
} from '@/data/mockAnalytics';

export default function AnalyticsPage() {
  const metrics = MOCK_ANALYTICS_METRICS;

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="mt-1 text-muted-foreground">
            Track your business performance and customer engagement
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <AnimatedCard delay={0}>
            <MetricCard
              label="Total Customers"
              value={metrics.totalCustomers}
              trend={{ direction: 'up', percentage: 12 }}
            />
          </AnimatedCard>
          <AnimatedCard delay={0.1}>
            <MetricCard
              label="Repeat Booking Rate"
              value={metrics.repeatBookingRate}
              format="percentage"
              trend={{ direction: 'up', percentage: 5 }}
            />
          </AnimatedCard>
          <AnimatedCard delay={0.2}>
            <MetricCard
              label="Avg Review Rating"
              value={metrics.averageReviewRating}
              format="rating"
              trend={{ direction: 'up', percentage: 3 }}
            />
          </AnimatedCard>
          <AnimatedCard delay={0.3}>
            <MetricCard
              label="Retention Rate"
              value={metrics.retentionRate}
              format="percentage"
              trend={{ direction: 'up', percentage: 8 }}
            />
          </AnimatedCard>
          <AnimatedCard delay={0.4}>
            <MetricCard
              label="Weekly App Sessions"
              value={metrics.weeklyAppSessions}
              trend={{ direction: 'up', percentage: 15 }}
            />
          </AnimatedCard>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AnimatedCard delay={0.5}>
            <EngagementChart data={MOCK_ENGAGEMENT_DATA} />
          </AnimatedCard>
          <AnimatedCard delay={0.6}>
            <BookingsChart data={MOCK_BOOKINGS_DATA} />
          </AnimatedCard>
        </div>
      </div>
    </PageTransition>
  );
}
