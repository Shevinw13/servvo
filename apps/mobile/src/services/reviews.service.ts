/**
 * Reviews service — API calls for review management.
 */

import api from './api';

export interface Review {
  id: string;
  user_id: string;
  appointment_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface CreateReviewData {
  appointmentId: string;
  rating: number;
  comment?: string;
}

/**
 * Creates a review for a completed appointment.
 */
export async function createReview(data: CreateReviewData): Promise<Review> {
  const response = await api.post<Review>('/reviews', data);
  return response.data;
}

/**
 * Fetches all reviews by the authenticated user.
 */
export async function getUserReviews(): Promise<Review[]> {
  const response = await api.get<Review[]>('/reviews');
  return response.data;
}

/**
 * Fetches the review for a specific appointment.
 */
export async function getReviewByAppointment(
  appointmentId: string,
): Promise<Review> {
  const response = await api.get<Review>(
    `/appointments/${appointmentId}/review`,
  );
  return response.data;
}
