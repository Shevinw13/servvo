import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { BrandConfig } from './brand-config.entity';
import { REDIS_CLIENT } from '../../config/redis/redis.module';

export interface BrandConfigResponse {
  logo_url: string | null;
  primary_color: string;
  accent_color: string;
  service_provider_term: string;
  imagery: Record<string, any> | null;
}

const DEFAULT_BRAND_CONFIG: BrandConfigResponse = {
  logo_url: null,
  primary_color: '#1B365D',
  accent_color: '#4CAF50',
  service_provider_term: 'Service Professional',
  imagery: null,
};

const CACHE_TTL_SECONDS = 300; // 5 minutes

@Injectable()
export class BusinessesService {
  constructor(
    @InjectRepository(BrandConfig)
    private readonly brandConfigRepository: Repository<BrandConfig>,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  async getBrandConfig(businessId: string): Promise<BrandConfigResponse> {
    const cacheKey = `brand_config:${businessId}`;

    // Try Redis cache first
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Cache miss — fetch from DB
    const brandConfig = await this.brandConfigRepository.findOne({
      where: { business_id: businessId },
    });

    if (!brandConfig) {
      // Cache the default so we don't hit DB repeatedly for missing configs
      await this.redis.set(
        cacheKey,
        JSON.stringify(DEFAULT_BRAND_CONFIG),
        'EX',
        CACHE_TTL_SECONDS,
      );
      return DEFAULT_BRAND_CONFIG;
    }

    const response: BrandConfigResponse = {
      logo_url: brandConfig.logo_url || null,
      primary_color: brandConfig.primary_color || DEFAULT_BRAND_CONFIG.primary_color,
      accent_color: brandConfig.accent_color || DEFAULT_BRAND_CONFIG.accent_color,
      service_provider_term:
        brandConfig.service_provider_term || DEFAULT_BRAND_CONFIG.service_provider_term,
      imagery: brandConfig.imagery || null,
    };

    // Cache the result
    await this.redis.set(
      cacheKey,
      JSON.stringify(response),
      'EX',
      CACHE_TTL_SECONDS,
    );

    return response;
  }
}
