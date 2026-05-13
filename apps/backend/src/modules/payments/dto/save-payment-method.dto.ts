import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';

export class SavePaymentMethodDto {
  @IsNotEmpty()
  @IsString()
  stripePaymentMethodId: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  last4: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsNotEmpty()
  @IsInt()
  expMonth: number;

  @IsNotEmpty()
  @IsInt()
  expYear: number;
}
