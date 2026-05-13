import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MediaService } from './media.service';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('media')
@UseGuards(AuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get(':key')
  async getSignedUrl(
    @Param('key') key: string,
  ): Promise<{ url: string; expiresIn: number }> {
    return this.mediaService.getSignedUrl(key);
  }
}
