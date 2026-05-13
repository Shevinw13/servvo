import { IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';

export class CreatePropertyDto {
  @IsNotEmpty()
  @IsString()
  address_line1: string;

  @IsOptional()
  @IsString()
  address_line2?: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  zip: string;

  @IsOptional()
  @IsObject()
  details?: Record<string, any>;
}
