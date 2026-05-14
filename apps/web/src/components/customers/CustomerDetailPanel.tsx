'use client';

import { Customer } from '@/types/customer';
import { X, Mail, Phone, MapPin, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomerDetailPanelProps {
  customer: Customer | null;
  onClose: () => void;
}

export function CustomerDetailPanel({ customer, onClose }: CustomerDetailPanelProps) {
  return (
    <AnimatePresence>
      {customer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-border bg-card shadow-2xl"
          >
            <div className="p-6">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Customer Details</h2>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Profile */}
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  {customer.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">{customer.name}</p>
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    customer.engagementStatus === 'active'
                      ? 'bg-green-100 text-green-700'
                      : customer.engagementStatus === 'due_for_rebooking'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-600'
                  }`}>
                    {customer.engagementStatus === 'due_for_rebooking' ? 'Due for Rebooking' : customer.engagementStatus === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mb-6 space-y-3 rounded-xl border border-border p-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{customer.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{customer.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{customer.propertyAddress}</span>
                </div>
              </div>

              {/* Metrics */}
              <div className="mb-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">{customer.metrics.totalServices}</p>
                  <p className="text-xs text-muted-foreground">Total Services</p>
                </div>
                <div className="rounded-xl border border-border p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">
                    <Star className="mr-1 inline h-4 w-4 text-yellow-500" />
                    {customer.metrics.averageRating}
                  </p>
                  <p className="text-xs text-muted-foreground">Avg Rating</p>
                </div>
                <div className="rounded-xl border border-border p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">
                    ${customer.metrics.lifetimeValue.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Lifetime Value</p>
                </div>
                <div className="rounded-xl border border-border p-4 text-center">
                  <p className="text-sm font-semibold text-foreground">
                    {new Date(customer.metrics.lastEngagement).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Last Engagement</p>
                </div>
              </div>

              {/* Service History */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">Service History</h3>
                <div className="space-y-2">
                  {customer.serviceHistory.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{service.serviceType}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(service.date).toLocaleDateString()} • {service.provider}
                        </p>
                      </div>
                      {service.rating && (
                        <div className="flex items-center gap-1 text-xs text-yellow-600">
                          <Star className="h-3 w-3 fill-current" />
                          {service.rating}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
