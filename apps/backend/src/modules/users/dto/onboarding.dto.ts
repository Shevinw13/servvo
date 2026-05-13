import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  IsObject,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isNotBlank', async: false })
export class IsNotBlankConstraint implements ValidatorConstraintInterface {
  validate(value: any, _args: ValidationArguments): boolean {
    if (typeof value !== 'string') return false;
    return value.trim().length > 0;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must not be empty or whitespace`;
  }
}

export class OnboardingDto {
  @IsNotEmpty()
  @IsString()
  @Validate(IsNotBlankConstraint)
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsString()
  @Validate(IsNotBlankConstraint)
  address_line1: string;

  @IsOptional()
  @IsString()
  address_line2?: string;

  @IsNotEmpty()
  @IsString()
  @Validate(IsNotBlankConstraint)
  city: string;

  @IsNotEmpty()
  @IsString()
  @Validate(IsNotBlankConstraint)
  state: string;

  @IsNotEmpty()
  @IsString()
  @Validate(IsNotBlankConstraint)
  zip: string;

  @IsOptional()
  @IsObject()
  property_details?: Record<string, any>;
}
