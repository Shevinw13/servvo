export enum ServiceStatus {
  SCHEDULED = 'scheduled',
  PROVIDER_ASSIGNED = 'provider_assigned',
  ON_THE_WAY = 'on_the_way',
  ARRIVED = 'arrived',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum InvoiceStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
  OVERDUE = 'overdue',
}

export enum SenderType {
  CUSTOMER = 'customer',
  BUSINESS = 'business',
  SYSTEM = 'system',
}
