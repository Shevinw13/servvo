import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Payment } from './payment.entity';
import { PaymentMethod } from './payment-method.entity';
import { Invoice } from '../invoices/invoice.entity';
import { InvoiceStatus } from '../../common/enums';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaymentIntentResult {
  clientSecret: string;
  amount: number;
  currency: string;
}

@Injectable()
export class PaymentsService {
  private stripe: InstanceType<typeof Stripe>;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    private readonly configService: ConfigService,
  ) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    this.stripe = new Stripe(stripeSecretKey || '');
  }

  async createPaymentIntent(
    userId: string,
    invoiceId: string,
  ): Promise<PaymentIntentResult> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (invoice.user_id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to pay this invoice',
      );
    }

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Invoice is already paid');
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: invoice.amount_cents,
      currency: invoice.currency,
      metadata: {
        invoiceId: invoice.id,
        userId,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret!,
      amount: invoice.amount_cents,
      currency: invoice.currency,
    };
  }

  async confirmPayment(
    userId: string,
    paymentIntentId: string,
    invoiceId: string,
  ): Promise<Payment> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (invoice.user_id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to pay this invoice',
      );
    }

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Invoice is already paid');
    }

    // Retrieve the PaymentIntent from Stripe to verify status
    const paymentIntent =
      await this.stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      throw new BadRequestException(
        `Payment has not succeeded. Current status: ${paymentIntent.status}`,
      );
    }

    // Update invoice status to paid
    invoice.status = InvoiceStatus.PAID;
    await this.invoiceRepository.save(invoice);

    // Create payment record
    const payment = this.paymentRepository.create({
      invoice_id: invoiceId,
      user_id: userId,
      stripe_payment_intent_id: paymentIntentId,
      amount_cents: invoice.amount_cents,
      status: 'succeeded',
      payment_method_type: paymentIntent.payment_method_types?.[0] || undefined,
    });

    return this.paymentRepository.save(payment) as Promise<Payment>;
  }

  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    return this.paymentMethodRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async savePaymentMethod(
    userId: string,
    data: {
      stripePaymentMethodId: string;
      type: string;
      last4: string;
      brand?: string;
      expMonth: number;
      expYear: number;
    },
  ): Promise<PaymentMethod> {
    const paymentMethod = this.paymentMethodRepository.create({
      user_id: userId,
      stripe_payment_method_id: data.stripePaymentMethodId,
      type: data.type,
      last4: data.last4,
      brand: data.brand || undefined,
      exp_month: data.expMonth,
      exp_year: data.expYear,
    });

    return this.paymentMethodRepository.save(paymentMethod) as Promise<PaymentMethod>;
  }

  async deletePaymentMethod(
    userId: string,
    paymentMethodId: string,
  ): Promise<void> {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { id: paymentMethodId },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    if (paymentMethod.user_id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this payment method',
      );
    }

    await this.paymentMethodRepository.remove(paymentMethod);
  }

  async getPaymentHistory(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<PaginatedResult<Payment>> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.paymentRepository.findAndCount({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      skip,
      take: limit,
      relations: ['invoice'],
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
