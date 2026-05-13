import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Payment } from './payment.entity';
import { PaymentMethod } from './payment-method.entity';
import { Invoice } from '../invoices/invoice.entity';
import { InvoiceStatus } from '../../common/enums';

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: jest.fn(),
      retrieve: jest.fn(),
    },
  }));
});

describe('PaymentsService', () => {
  let service: PaymentsService;
  let mockPaymentRepository: any;
  let mockPaymentMethodRepository: any;
  let mockInvoiceRepository: any;
  let mockStripe: any;

  beforeEach(async () => {
    mockPaymentRepository = {
      create: jest.fn((data) => ({ id: 'payment-1', created_at: new Date(), ...data })),
      save: jest.fn((entity) => Promise.resolve(entity)),
      findAndCount: jest.fn(),
    };

    mockPaymentMethodRepository = {
      create: jest.fn((data) => ({ id: 'pm-1', created_at: new Date(), ...data })),
      save: jest.fn((entity) => Promise.resolve(entity)),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    mockInvoiceRepository = {
      findOne: jest.fn(),
      save: jest.fn((entity) => Promise.resolve(entity)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getRepositoryToken(Payment),
          useValue: mockPaymentRepository,
        },
        {
          provide: getRepositoryToken(PaymentMethod),
          useValue: mockPaymentMethodRepository,
        },
        {
          provide: getRepositoryToken(Invoice),
          useValue: mockInvoiceRepository,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('sk_test_fake_key'),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    // Access the mocked stripe instance
    mockStripe = (service as any).stripe;
  });

  describe('createPaymentIntent', () => {
    const userId = 'user-1';
    const invoiceId = 'invoice-1';

    it('should create a payment intent for a valid unpaid invoice', async () => {
      const invoice = {
        id: invoiceId,
        user_id: userId,
        amount_cents: 5000,
        currency: 'usd',
        status: InvoiceStatus.UNPAID,
      };

      mockInvoiceRepository.findOne.mockResolvedValue(invoice);
      mockStripe.paymentIntents.create.mockResolvedValue({
        client_secret: 'pi_secret_123',
        amount: 5000,
        currency: 'usd',
      });

      const result = await service.createPaymentIntent(userId, invoiceId);

      expect(result).toEqual({
        clientSecret: 'pi_secret_123',
        amount: 5000,
        currency: 'usd',
      });
      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith({
        amount: 5000,
        currency: 'usd',
        metadata: {
          invoiceId,
          userId,
        },
      });
    });

    it('should throw NotFoundException when invoice does not exist', async () => {
      mockInvoiceRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createPaymentIntent(userId, invoiceId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when invoice belongs to another user', async () => {
      const invoice = {
        id: invoiceId,
        user_id: 'other-user',
        amount_cents: 5000,
        currency: 'usd',
        status: InvoiceStatus.UNPAID,
      };

      mockInvoiceRepository.findOne.mockResolvedValue(invoice);

      await expect(
        service.createPaymentIntent(userId, invoiceId),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException when invoice is already paid', async () => {
      const invoice = {
        id: invoiceId,
        user_id: userId,
        amount_cents: 5000,
        currency: 'usd',
        status: InvoiceStatus.PAID,
      };

      mockInvoiceRepository.findOne.mockResolvedValue(invoice);

      await expect(
        service.createPaymentIntent(userId, invoiceId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create payment intent for overdue invoice', async () => {
      const invoice = {
        id: invoiceId,
        user_id: userId,
        amount_cents: 7500,
        currency: 'usd',
        status: InvoiceStatus.OVERDUE,
      };

      mockInvoiceRepository.findOne.mockResolvedValue(invoice);
      mockStripe.paymentIntents.create.mockResolvedValue({
        client_secret: 'pi_secret_456',
        amount: 7500,
        currency: 'usd',
      });

      const result = await service.createPaymentIntent(userId, invoiceId);

      expect(result.clientSecret).toBe('pi_secret_456');
      expect(result.amount).toBe(7500);
    });
  });

  describe('confirmPayment', () => {
    const userId = 'user-1';
    const invoiceId = 'invoice-1';
    const paymentIntentId = 'pi_123';

    it('should confirm payment and update invoice status to paid', async () => {
      const invoice = {
        id: invoiceId,
        user_id: userId,
        amount_cents: 5000,
        currency: 'usd',
        status: InvoiceStatus.UNPAID,
      };

      mockInvoiceRepository.findOne.mockResolvedValue(invoice);
      mockStripe.paymentIntents.retrieve.mockResolvedValue({
        status: 'succeeded',
        payment_method_types: ['card'],
      });

      const result = await service.confirmPayment(userId, paymentIntentId, invoiceId);

      expect(mockInvoiceRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: InvoiceStatus.PAID }),
      );
      expect(mockPaymentRepository.create).toHaveBeenCalledWith({
        invoice_id: invoiceId,
        user_id: userId,
        stripe_payment_intent_id: paymentIntentId,
        amount_cents: 5000,
        status: 'succeeded',
        payment_method_type: 'card',
      });
      expect(mockPaymentRepository.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw BadRequestException when payment intent has not succeeded', async () => {
      const invoice = {
        id: invoiceId,
        user_id: userId,
        amount_cents: 5000,
        currency: 'usd',
        status: InvoiceStatus.UNPAID,
      };

      mockInvoiceRepository.findOne.mockResolvedValue(invoice);
      mockStripe.paymentIntents.retrieve.mockResolvedValue({
        status: 'requires_payment_method',
        payment_method_types: ['card'],
      });

      await expect(
        service.confirmPayment(userId, paymentIntentId, invoiceId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when invoice does not exist', async () => {
      mockInvoiceRepository.findOne.mockResolvedValue(null);

      await expect(
        service.confirmPayment(userId, paymentIntentId, invoiceId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when invoice belongs to another user', async () => {
      const invoice = {
        id: invoiceId,
        user_id: 'other-user',
        amount_cents: 5000,
        currency: 'usd',
        status: InvoiceStatus.UNPAID,
      };

      mockInvoiceRepository.findOne.mockResolvedValue(invoice);

      await expect(
        service.confirmPayment(userId, paymentIntentId, invoiceId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getPaymentMethods', () => {
    it('should return payment methods for user ordered by created_at DESC', async () => {
      const methods = [
        { id: 'pm-1', user_id: 'user-1', last4: '4242' },
        { id: 'pm-2', user_id: 'user-1', last4: '1234' },
      ];
      mockPaymentMethodRepository.find.mockResolvedValue(methods);

      const result = await service.getPaymentMethods('user-1');

      expect(mockPaymentMethodRepository.find).toHaveBeenCalledWith({
        where: { user_id: 'user-1' },
        order: { created_at: 'DESC' },
      });
      expect(result).toEqual(methods);
    });
  });

  describe('savePaymentMethod', () => {
    it('should save a new payment method', async () => {
      const data = {
        stripePaymentMethodId: 'pm_stripe_123',
        type: 'card',
        last4: '4242',
        brand: 'visa',
        expMonth: 12,
        expYear: 2025,
      };

      const result = await service.savePaymentMethod('user-1', data);

      expect(mockPaymentMethodRepository.create).toHaveBeenCalledWith({
        user_id: 'user-1',
        stripe_payment_method_id: 'pm_stripe_123',
        type: 'card',
        last4: '4242',
        brand: 'visa',
        exp_month: 12,
        exp_year: 2025,
      });
      expect(mockPaymentMethodRepository.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('deletePaymentMethod', () => {
    it('should delete a payment method owned by the user', async () => {
      const paymentMethod = { id: 'pm-1', user_id: 'user-1' };
      mockPaymentMethodRepository.findOne.mockResolvedValue(paymentMethod);

      await service.deletePaymentMethod('user-1', 'pm-1');

      expect(mockPaymentMethodRepository.remove).toHaveBeenCalledWith(paymentMethod);
    });

    it('should throw NotFoundException when payment method does not exist', async () => {
      mockPaymentMethodRepository.findOne.mockResolvedValue(null);

      await expect(
        service.deletePaymentMethod('user-1', 'pm-nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when payment method belongs to another user', async () => {
      const paymentMethod = { id: 'pm-1', user_id: 'other-user' };
      mockPaymentMethodRepository.findOne.mockResolvedValue(paymentMethod);

      await expect(
        service.deletePaymentMethod('user-1', 'pm-1'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getPaymentHistory', () => {
    it('should return paginated payment history', async () => {
      const payments = [
        { id: 'pay-1', amount_cents: 5000, created_at: new Date() },
        { id: 'pay-2', amount_cents: 3000, created_at: new Date() },
      ];
      mockPaymentRepository.findAndCount.mockResolvedValue([payments, 2]);

      const result = await service.getPaymentHistory('user-1', 1, 20);

      expect(mockPaymentRepository.findAndCount).toHaveBeenCalledWith({
        where: { user_id: 'user-1' },
        order: { created_at: 'DESC' },
        skip: 0,
        take: 20,
        relations: ['invoice'],
      });
      expect(result.data).toEqual(payments);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.totalPages).toBe(1);
    });

    it('should calculate correct skip for page 2', async () => {
      mockPaymentRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.getPaymentHistory('user-1', 2, 10);

      expect(mockPaymentRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        }),
      );
    });
  });
});
