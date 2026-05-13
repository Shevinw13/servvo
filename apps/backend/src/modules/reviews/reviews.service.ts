import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
  ) {}

  async createReview(
    userId: string,
    appointmentId: string,
    rating: number,
    comment?: string,
  ): Promise<Review> {
    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const existing = await this.reviewRepo.findOne({
      where: { user_id: userId, appointment_id: appointmentId },
    });
    if (existing) {
      throw new BadRequestException('Review already exists for this appointment');
    }

    const review = this.reviewRepo.create({
      user_id: userId,
      appointment_id: appointmentId,
      rating,
      comment: comment ?? undefined,
    });

    return this.reviewRepo.save(review);
  }

  async getUserReviews(userId: string): Promise<Review[]> {
    return this.reviewRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async getReviewByAppointment(appointmentId: string): Promise<Review | null> {
    return this.reviewRepo.findOne({
      where: { appointment_id: appointmentId },
    });
  }
}
