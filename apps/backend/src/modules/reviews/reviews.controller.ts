import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

interface CreateReviewDto {
  appointmentId: string;
  rating: number;
  comment?: string;
}

@Controller()
@UseGuards(AuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('reviews')
  async createReview(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.createReview(
      userId,
      dto.appointmentId,
      dto.rating,
      dto.comment,
    );
  }

  @Get('reviews')
  async getUserReviews(@CurrentUser('id') userId: string) {
    return this.reviewsService.getUserReviews(userId);
  }

  @Get('appointments/:id/review')
  async getReviewByAppointment(@Param('id') appointmentId: string) {
    return this.reviewsService.getReviewByAppointment(appointmentId);
  }
}
