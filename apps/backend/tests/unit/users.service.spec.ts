import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { OnboardingDto } from '../../src/modules/users/dto/onboarding.dto';
import { UpdateProfileDto } from '../../src/modules/users/dto/update-profile.dto';

describe('OnboardingDto validation', () => {
  const validData = {
    name: 'John Doe',
    email: 'john@example.com',
    address_line1: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zip: '62701',
  };

  it('should pass with valid data', async () => {
    const dto = plainToInstance(OnboardingDto, validData);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should pass with optional fields omitted', async () => {
    const dto = plainToInstance(OnboardingDto, {
      name: 'Jane',
      address_line1: '456 Oak Ave',
      city: 'Portland',
      state: 'OR',
      zip: '97201',
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should reject empty name', async () => {
    const dto = plainToInstance(OnboardingDto, { ...validData, name: '' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const nameError = errors.find((e) => e.property === 'name');
    expect(nameError).toBeDefined();
  });

  it('should reject whitespace-only name', async () => {
    const dto = plainToInstance(OnboardingDto, { ...validData, name: '   ' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const nameError = errors.find((e) => e.property === 'name');
    expect(nameError).toBeDefined();
  });

  it('should reject null name', async () => {
    const dto = plainToInstance(OnboardingDto, { ...validData, name: null });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const nameError = errors.find((e) => e.property === 'name');
    expect(nameError).toBeDefined();
  });

  it('should reject missing name', async () => {
    const { name, ...noName } = validData;
    const dto = plainToInstance(OnboardingDto, noName);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const nameError = errors.find((e) => e.property === 'name');
    expect(nameError).toBeDefined();
  });

  it('should reject empty address_line1', async () => {
    const dto = plainToInstance(OnboardingDto, {
      ...validData,
      address_line1: '',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const addrError = errors.find((e) => e.property === 'address_line1');
    expect(addrError).toBeDefined();
  });

  it('should reject whitespace-only address_line1', async () => {
    const dto = plainToInstance(OnboardingDto, {
      ...validData,
      address_line1: '   \t  ',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const addrError = errors.find((e) => e.property === 'address_line1');
    expect(addrError).toBeDefined();
  });

  it('should reject empty city', async () => {
    const dto = plainToInstance(OnboardingDto, { ...validData, city: '' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const cityError = errors.find((e) => e.property === 'city');
    expect(cityError).toBeDefined();
  });

  it('should reject whitespace-only state', async () => {
    const dto = plainToInstance(OnboardingDto, { ...validData, state: '  ' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const stateError = errors.find((e) => e.property === 'state');
    expect(stateError).toBeDefined();
  });

  it('should reject empty zip', async () => {
    const dto = plainToInstance(OnboardingDto, { ...validData, zip: '' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const zipError = errors.find((e) => e.property === 'zip');
    expect(zipError).toBeDefined();
  });

  it('should accept valid property_details as optional object', async () => {
    const dto = plainToInstance(OnboardingDto, {
      ...validData,
      property_details: { lot_size: '0.5 acres', lawn_type: 'bermuda' },
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});

describe('UpdateProfileDto validation', () => {
  it('should pass with valid name and email', async () => {
    const dto = plainToInstance(UpdateProfileDto, {
      name: 'John',
      email: 'john@example.com',
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should pass with empty body (all optional)', async () => {
    const dto = plainToInstance(UpdateProfileDto, {});
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should reject invalid email format', async () => {
    const dto = plainToInstance(UpdateProfileDto, { email: 'not-an-email' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const emailError = errors.find((e) => e.property === 'email');
    expect(emailError).toBeDefined();
  });
});
