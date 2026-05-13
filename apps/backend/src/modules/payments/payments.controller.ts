import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { PaymentsService } from './payments.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { SavePaymentMethodDto } from './dto/save-payment-method.dto';

@Controller('payments')
@UseGuards(AuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('intent')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createPaymentIntent(
    @CurrentUser() user: User,
    @Body() dto: CreatePaymentIntentDto,
  ) {
    return this.paymentsService.createPaymentIntent(user.id, dto.invoiceId);
  }

  @Post('confirm')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async confirmPayment(
    @CurrentUser() user: User,
    @Body() dto: ConfirmPaymentDto,
  ) {
    return this.paymentsService.confirmPayment(
      user.id,
      dto.paymentIntentId,
      dto.invoiceId,
    );
  }

  @Get('methods')
  async getPaymentMethods(@CurrentUser() user: User) {
    return this.paymentsService.getPaymentMethods(user.id);
  }

  @Post('methods')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async savePaymentMethod(
    @CurrentUser() user: User,
    @Body() dto: SavePaymentMethodDto,
  ) {
    return this.paymentsService.savePaymentMethod(user.id, {
      stripePaymentMethodId: dto.stripePaymentMethodId,
      type: dto.type,
      last4: dto.last4,
      brand: dto.brand,
      expMonth: dto.expMonth,
      expYear: dto.expYear,
    });
  }

  @Delete('methods/:id')
  async deletePaymentMethod(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ) {
    await this.paymentsService.deletePaymentMethod(user.id, id);
    return { message: 'Payment method deleted successfully' };
  }

  @Get('history')
  async getPaymentHistory(
    @CurrentUser() user: User,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const parsedPage = page ? parseInt(page, 10) : 1;
    const parsedLimit = limit ? parseInt(limit, 10) : 20;
    return this.paymentsService.getPaymentHistory(
      user.id,
      parsedPage,
      parsedLimit,
    );
  }
}
