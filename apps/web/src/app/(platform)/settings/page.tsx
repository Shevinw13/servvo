'use client';

import { PageTransition } from '@/components/shared/PageTransition';
import { AnimatedCard } from '@/components/shared/AnimatedCard';
import { Palette, MessageSquare, Plug, Bell } from 'lucide-react';
import Link from 'next/link';

const settingsLinks = [
  { label: 'Branding', description: 'Logo, colors, typography, and imagery', icon: Palette, href: '/branding' },
  { label: 'Customer Experience', description: 'Messaging tone and notification templates', icon: MessageSquare, href: '/customer-experience' },
  { label: 'CRM Integrations', description: 'Connect and manage your CRM tools', icon: Plug, href: '/integrations' },
  { label: 'Notifications', description: 'Review requests and rebooking settings', icon: Bell, href: '/notifications' },
];

export default function SettingsPage() {
  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your platform configuration
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {settingsLinks.map((link, i) => (
            <AnimatedCard key={link.href} delay={0.1 * i}>
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
    </PageTransition>
  );
}
