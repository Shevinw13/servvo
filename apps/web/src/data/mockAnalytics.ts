import { AnalyticsMetrics, EngagementDataPoint, BookingsDataPoint } from '@/types/analytics';

function generateEngagementData(): EngagementDataPoint[] {
  const data: EngagementDataPoint[] = [];
  const baseDate = new Date('2024-02-20');

  for (let i = 0; i < 30; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);
    const dayOfWeek = date.getDay();
    // Higher sessions on weekdays, lower on weekends
    const baseSessions = dayOfWeek === 0 || dayOfWeek === 6 ? 45 : 72;
    const variance = Math.floor(Math.random() * 20) - 10;
    data.push({
      date: date.toISOString().split('T')[0],
      sessions: baseSessions + variance + Math.floor(i * 0.5),
    });
  }

  return data;
}

export const MOCK_ENGAGEMENT_DATA: EngagementDataPoint[] = [
  { date: '2024-02-20', sessions: 65 },
  { date: '2024-02-21', sessions: 72 },
  { date: '2024-02-22', sessions: 78 },
  { date: '2024-02-23', sessions: 69 },
  { date: '2024-02-24', sessions: 48 },
  { date: '2024-02-25', sessions: 42 },
  { date: '2024-02-26', sessions: 74 },
  { date: '2024-02-27', sessions: 81 },
  { date: '2024-02-28', sessions: 76 },
  { date: '2024-02-29', sessions: 83 },
  { date: '2024-03-01', sessions: 71 },
  { date: '2024-03-02', sessions: 52 },
  { date: '2024-03-03', sessions: 45 },
  { date: '2024-03-04', sessions: 79 },
  { date: '2024-03-05', sessions: 85 },
  { date: '2024-03-06', sessions: 88 },
  { date: '2024-03-07', sessions: 82 },
  { date: '2024-03-08', sessions: 77 },
  { date: '2024-03-09', sessions: 55 },
  { date: '2024-03-10', sessions: 49 },
  { date: '2024-03-11', sessions: 86 },
  { date: '2024-03-12', sessions: 91 },
  { date: '2024-03-13', sessions: 89 },
  { date: '2024-03-14', sessions: 94 },
  { date: '2024-03-15', sessions: 87 },
  { date: '2024-03-16', sessions: 58 },
  { date: '2024-03-17', sessions: 51 },
  { date: '2024-03-18', sessions: 92 },
  { date: '2024-03-19', sessions: 96 },
  { date: '2024-03-20', sessions: 98 },
];

export const MOCK_BOOKINGS_DATA: BookingsDataPoint[] = [
  { week: 'Week 1', bookings: 34 },
  { week: 'Week 2', bookings: 38 },
  { week: 'Week 3', bookings: 42 },
  { week: 'Week 4', bookings: 39 },
  { week: 'Week 5', bookings: 45 },
  { week: 'Week 6', bookings: 48 },
  { week: 'Week 7', bookings: 52 },
  { week: 'Week 8', bookings: 55 },
];

export const MOCK_ANALYTICS_METRICS: AnalyticsMetrics = {
  totalCustomers: 247,
  repeatBookingRate: 73,
  averageReviewRating: 4.6,
  retentionRate: 82,
  weeklyAppSessions: 98,
};

export { generateEngagementData };
