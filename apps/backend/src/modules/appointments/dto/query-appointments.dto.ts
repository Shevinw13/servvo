import { IsOptional, IsIn, IsNumberString } from 'class-validator';

export class QueryAppointmentsDto {
  @IsOptional()
  @IsIn(['upcoming', 'past'])
  filter?: 'upcoming' | 'past';

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
