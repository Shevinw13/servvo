export interface ServiceRecord {
  id: string;
  date: string;
  serviceType: string;
  provider: string;
  rating?: number;
}

export interface CustomerMetrics {
  totalServices: number;
  averageRating: number;
  lifetimeValue: number;
  lastEngagement: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyAddress: string;
  lastServiceDate: string;
  engagementStatus: 'active' | 'inactive' | 'due_for_rebooking';
  serviceHistory: ServiceRecord[];
  metrics: CustomerMetrics;
}
