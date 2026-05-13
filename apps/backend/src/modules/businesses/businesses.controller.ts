import { Controller, Get, Param } from '@nestjs/common';
import { BusinessesService, BrandConfigResponse } from './businesses.service';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Get(':id/brand-config')
  async getBrandConfig(
    @Param('id') id: string,
  ): Promise<BrandConfigResponse> {
    return this.businessesService.getBrandConfig(id);
  }
}
