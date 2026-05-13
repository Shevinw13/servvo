import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

interface CreateBookingDto {
  serviceType: string;
  date: string;
  windowStart: string;
  windowEnd: string;
  propertyId?: string;
  notes?: string;
}

@Controller('bookings')
@UseGuards(AuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('available-dates')
  async getAvailableDates() {
    return this.bookingsService.getAvailableDates();
  }

  @Get('available-windows')
  async getAvailableWindows(@Query('date') date: string) {
    return this.bookingsService.getAvailableWindows(date);
  }

  @Post()
  async createBooking(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookingsService.createBooking(userId, dto);
  }
}
