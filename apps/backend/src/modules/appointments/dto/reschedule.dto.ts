import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RescheduleDto {
  @IsNotEmpty()
  @IsString()
  date: string;

  @IsOptional()
  @IsString()
  arrivalWindowStart?: string;

  @IsOptional()
  @IsString()
  arrivalWindowEnd?: string;
}
