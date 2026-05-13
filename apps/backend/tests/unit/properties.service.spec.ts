import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreatePropertyDto } from '../../src/modules/properties/dto/create-property.dto';
import { UpdatePropertyDto } from '../../src/modules/properties/dto/update-property.dto';
import { PropertiesService } from '../../src/modules/properties/properties.service';

describe('CreatePropertyDto validation', () => {
  const validData = {
    address_line1: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zip: '62701',
  };

  it('should pass with valid required fields', async () => {
    const dto = plainToInstance(CreatePropertyDto, validData);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should pass with all fields including optional', async () => {
    const dto = plainToInstance(CreatePropertyDto, {
      ...validData,
      address_line2: 'Apt 4B',
      details: { lot_size: '0.5 acres' },
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should reject missing address_line1', async () => {
    const { address_line1, ...noAddr } = validData;
    const dto = plainToInstance(CreatePropertyDto, noAddr);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.find((e) => e.property === 'address_line1')).toBeDefined();
  });

  it('should reject empty city', async () => {
    const dto = plainToInstance(CreatePropertyDto, { ...validData, city: '' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.find((e) => e.property === 'city')).toBeDefined();
  });

  it('should reject missing state', async () => {
    const { state, ...noState } = validData;
    const dto = plainToInstance(CreatePropertyDto, noState);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.find((e) => e.property === 'state')).toBeDefined();
  });

  it('should reject missing zip', async () => {
    const { zip, ...noZip } = validData;
    const dto = plainToInstance(CreatePropertyDto, noZip);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.find((e) => e.property === 'zip')).toBeDefined();
  });
});

describe('UpdatePropertyDto validation', () => {
  it('should pass with empty body (all optional)', async () => {
    const dto = plainToInstance(UpdatePropertyDto, {});
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should pass with partial fields', async () => {
    const dto = plainToInstance(UpdatePropertyDto, { city: 'Portland' });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should pass with details object', async () => {
    const dto = plainToInstance(UpdatePropertyDto, {
      details: { lawn_type: 'bermuda' },
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});

describe('PropertiesService', () => {
  let service: PropertiesService;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneOrFail: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };
    service = new PropertiesService(mockRepository);
  });

  describe('findAllByUser', () => {
    it('should return all properties for a user', async () => {
      const userId = 'user-123';
      const properties = [
        { id: 'prop-1', user_id: userId, address_line1: '123 Main St' },
        { id: 'prop-2', user_id: userId, address_line1: '456 Oak Ave' },
      ];
      mockRepository.find.mockResolvedValue(properties);

      const result = await service.findAllByUser(userId);

      expect(result).toEqual(properties);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { user_id: userId },
      });
    });
  });

  describe('create', () => {
    it('should create a property for the user', async () => {
      const userId = 'user-123';
      const dto: CreatePropertyDto = {
        address_line1: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zip: '62701',
      };
      const created = { id: 'prop-1', user_id: userId, ...dto };
      mockRepository.create.mockReturnValue(created);
      mockRepository.save.mockResolvedValue(created);

      const result = await service.create(userId, dto);

      expect(result).toEqual(created);
      expect(mockRepository.create).toHaveBeenCalledWith({
        user_id: userId,
        ...dto,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(created);
    });
  });

  describe('update', () => {
    it('should update a property owned by the user', async () => {
      const userId = 'user-123';
      const propertyId = 'prop-1';
      const existing = { id: propertyId, user_id: userId, city: 'Springfield' };
      const dto: UpdatePropertyDto = { city: 'Portland' };
      const updated = { ...existing, ...dto };

      mockRepository.findOne.mockResolvedValue(existing);
      mockRepository.findOneOrFail.mockResolvedValue(updated);

      const result = await service.update(userId, propertyId, dto);

      expect(result).toEqual(updated);
      expect(mockRepository.update).toHaveBeenCalledWith(propertyId, dto);
    });

    it('should throw NotFoundException if property does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('user-123', 'nonexistent', { city: 'Portland' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if property belongs to another user', async () => {
      const existing = { id: 'prop-1', user_id: 'other-user' };
      mockRepository.findOne.mockResolvedValue(existing);

      await expect(
        service.update('user-123', 'prop-1', { city: 'Portland' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
