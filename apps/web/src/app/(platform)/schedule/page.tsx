'use client';

import { PageTransition } from '@/components/shared/PageTransition';
import { AnimatedCard } from '@/components/shared/AnimatedCard';
import { Calendar, Clock, CheckCircle, User, MapPin } from 'lucide-react';

const UPCOMING_SERVICES = [
  { id: '1', homeowner: 'Sarah Mitchell', service: 'Weekly Lawn Mowing', date: 'Today, 9:00 AM', provider: 'Joe L.', status: 'In Progress' },
  { id: '2', homeowner: 'David Nguyen', service: 'Perimeter Treatment', date: 'Today, 11:00 AM', provider: 'Sarah K.', status: 'Scheduled' },
  { id: '3', homeowner: 'Jennifer Adams', service: 'AC Tune-Up', date: 'Tomorrow, 10:00 AM', provider: 'Mike R.', status: 'Confirmed' },
  { id: '4', homeowner: 'Marcus Williams', service: 'Fertilization', date: 'Wed, May 22', provider: 'Joe L.', status: 'Confirmed' },
  { id: '5', homeowner: 'Lisa Patel', service: 'Filter Replacement', date: 'Thu, May 23', provider: 'Mike R.', status: 'Scheduled' },
];

const COMPLETED_TODAY = [
  { id: '1', homeowner: 'Robert Chen', service: 'Lawn Mowing', provider: 'Joe L.', time: '8:00 AM' },
  { id: '2', homeowner: 'Emily Rodriguez', service: 'Interior Inspection', provider: 'Sarah K.', time: '9:30 AM' },
];

export default function SchedulePage() {
  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Services</h1>
          <p className="mt-1 text-muted-foreground">
            Upcoming and completed service appointments
          </p>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <AnimatedCard delay={0}>
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Today</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-foreground">7</p>
              <p className="text-xs text-muted-foreground">appointments</p>
            </div>
          </AnimatedCard>
          <AnimatedCard delay={0.05}>
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-xs font-medium text-muted-foreground">Completed</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-foreground">2</p>
              <p className="text-xs text-muted-foreground">this morning</p>
            </div>
          </AnimatedCard>
          <AnimatedCard delay={0.1}>
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-medium text-muted-foreground">This Week</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-foreground">28</p>
              <p className="text-xs text-muted-foreground">total services</p>
            </div>
          </AnimatedCard>
        </div>

        {/* Upcoming Services */}
        <AnimatedCard delay={0.15}>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Upcoming Services
            </h2>
            <div className="space-y-3">
              {UPCOMING_SERVICES.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3 transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{service.service}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{service.homeowner}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-foreground">{service.date}</p>
                    <p className="text-xs text-muted-foreground">{service.provider}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    service.status === 'In Progress'
                      ? 'bg-green-100 text-green-700'
                      : service.status === 'Confirmed'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {service.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedCard>

        {/* Completed Today */}
        <AnimatedCard delay={0.2}>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Completed Today
            </h2>
            <div className="space-y-3">
              {COMPLETED_TODAY.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center gap-4 rounded-lg px-4 py-3"
                >
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{service.service}</p>
                    <p className="text-xs text-muted-foreground">{service.homeowner} · {service.provider}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{service.time}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedCard>
      </div>
    </PageTransition>
  );
}
