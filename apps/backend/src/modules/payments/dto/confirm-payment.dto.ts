import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ConfirmPaymentDto {
  @IsNotEmpty()
  @IsString()
  paymentIntentId: string;

  @IsNotEmpty()
  @IsUUID()
  invoiceId: string;
}
