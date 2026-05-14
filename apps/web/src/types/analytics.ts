export interface AnalyticsMetrics {
  totalCustomers: number;
  repeatBookingRate: number;
  averageReviewRating: number;
  retentionRate: number;
  weeklyAppSessions: number;
}

export interface EngagementDataPoint {
  date: string;
  sessions: number;
}

export interface BookingsDataPoint {
  week: string;
  bookings: number;
}
