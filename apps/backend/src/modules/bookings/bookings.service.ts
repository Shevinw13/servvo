import { Injectable } from '@nestjs/common';

interface AvailableDate {
  date: string;
  dayOfWeek: string;
  available: boolean;
}

interface TimeWindow {
  id: string;
  start: string;
  end: string;
  label: string;
  available: boolean;
}

interface CreateBookingData {
  serviceType: string;
  date: string;
  windowStart: string;
  windowEnd: string;
  propertyId?: string;
  notes?: string;
}

interface BookingResponse {
  id: string;
  userId: string;
  serviceType: string;
  date: string;
  windowStart: string;
  windowEnd: string;
  status: string;
  createdAt: string;
}

@Injectable()
export class BookingsService {
  /**
   * Returns available dates for the next 30 days (mock data).
   */
  getAvailableDates(): AvailableDate[] {
    const dates: AvailableDate[] = [];
    const today = new Date();

    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      // Weekdays are available, weekends are not
      const available = date.getDay() !== 0 && date.getDay() !== 6;

      dates.push({
        date: date.toISOString().split('T')[0],
        dayOfWeek,
        available,
      });
    }

    return dates;
  }

  /**
   * Returns available time windows for a given date (mock: 4 windows).
   */
  getAvailableWindows(date: string): TimeWindow[] {
    return [
      {
        id: `${date}-1`,
        start: `${date}T08:00:00.000Z`,
        end: `${date}T10:00:00.000Z`,
        label: '8:00 AM – 10:00 AM',
        available: true,
      },
      {
        id: `${date}-2`,
        start: `${date}T10:00:00.000Z`,
        end: `${date}T12:00:00.000Z`,
        label: '10:00 AM – 12:00 PM',
        available: true,
      },
      {
        id: `${date}-3`,
        start: `${date}T13:00:00.000Z`,
        end: `${date}T15:00:00.000Z`,
        label: '1:00 PM – 3:00 PM',
        available: true,
      },
      {
        id: `${date}-4`,
        start: `${date}T15:00:00.000Z`,
        end: `${date}T17:00:00.000Z`,
        label: '3:00 PM – 5:00 PM',
        available: true,
      },
    ];
  }

  /**
   * Creates a booking request (mock implementation).
   */
  createBooking(userId: string, data: CreateBookingData): BookingResponse {
    return {
      id: `booking-${Date.now()}`,
      userId,
      serviceType: data.serviceType,
      date: data.date,
      windowStart: data.windowStart,
      windowEnd: data.windowEnd,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }
}
