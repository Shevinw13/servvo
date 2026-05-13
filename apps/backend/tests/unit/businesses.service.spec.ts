import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BusinessesService, BrandConfigResponse } from '../../src/modules/businesses/businesses.service';
import { BrandConfig } from '../../src/modules/businesses/brand-config.entity';
import { REDIS_CLIENT } from '../../src/config/redis/redis.module';

describe('BusinessesService', () => {
  let service: BusinessesService;
  let mockRedis: { get: jest.Mock; set: jest.Mock };
  let mockBrandConfigRepo: { findOne: jest.Mock };

  const DEFAULT_BRAND_CONFIG: BrandConfigResponse = {
    logo_url: null,
    primary_color: '#1B365D',
    accent_color: '#4CAF50',
    service_provider_term: 'Service Professional',
    imagery: null,
  };

  beforeEach(async () => {
    mockRedis = {
      get: jest.fn(),
      set: jest.fn(),
    };

    mockBrandConfigRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessesService,
        {
          provide: getRepositoryToken(BrandConfig),
          useValue: mockBrandConfigRepo,
        },
        {
          provide: REDIS_CLIENT,
          useValue: mockRedis,
        },
      ],
    }).compile();

    service = module.get<BusinessesService>(BusinessesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBrandConfig', () => {
    const businessId = '123e4567-e89b-12d3-a456-426614174000';

    it('should return cached brand config from Redis when available', async () => {
      const cachedConfig: BrandConfigResponse = {
        logo_url: 'https://example.com/logo.png',
        primary_color: '#FF0000',
        accent_color: '#00FF00',
        service_provider_term: 'Crew',
        imagery: { dashboard: 'https://example.com/img.png' },
      };

      mockRedis.get.mockResolvedValue(JSON.stringify(cachedConfig));

      const result = await service.getBrandConfig(businessId);

      expect(result).toEqual(cachedConfig);
      expect(mockRedis.get).toHaveBeenCalledWith(`brand_config:${businessId}`);
      expect(mockBrandConfigRepo.findOne).not.toHaveBeenCalled();
    });

    it('should fetch from DB and cache when Redis cache misses', async () => {
      mockRedis.get.mockResolvedValue(null);

      const dbConfig = {
        id: 'config-id',
        business_id: businessId,
        logo_url: 'https://example.com/logo.png',
        primary_color: '#FF0000',
        accent_color: '#00FF00',
        service_provider_term: 'Team',
        imagery: { onboarding: ['img1.png'] },
        updated_at: new Date(),
      };

      mockBrandConfigRepo.findOne.mockResolvedValue(dbConfig);

      const result = await service.getBrandConfig(businessId);

      expect(result).toEqual({
        logo_url: 'https://example.com/logo.png',
        primary_color: '#FF0000',
        accent_color: '#00FF00',
        service_provider_term: 'Team',
        imagery: { onboarding: ['img1.png'] },
      });
      expect(mockRedis.set).toHaveBeenCalledWith(
        `brand_config:${businessId}`,
        JSON.stringify(result),
        'EX',
        300,
      );
    });

    it('should return default branding when no config exists in DB', async () => {
      mockRedis.get.mockResolvedValue(null);
      mockBrandConfigRepo.findOne.mockResolvedValue(null);

      const result = await service.getBrandConfig(businessId);

      expect(result).toEqual(DEFAULT_BRAND_CONFIG);
      expect(mockRedis.set).toHaveBeenCalledWith(
        `brand_config:${businessId}`,
        JSON.stringify(DEFAULT_BRAND_CONFIG),
        'EX',
        300,
      );
    });

    it('should use default values for null fields in DB config', async () => {
      mockRedis.get.mockResolvedValue(null);

      const dbConfig = {
        id: 'config-id',
        business_id: businessId,
        logo_url: null,
        primary_color: null,
        accent_color: null,
        service_provider_term: null,
        imagery: null,
        updated_at: new Date(),
      };

      mockBrandConfigRepo.findOne.mockResolvedValue(dbConfig);

      const result = await service.getBrandConfig(businessId);

      expect(result).toEqual(DEFAULT_BRAND_CONFIG);
    });
  });
});
