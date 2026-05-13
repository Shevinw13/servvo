import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify-token')
  @HttpCode(HttpStatus.OK)
  async verifyToken(@Body() dto: VerifyTokenDto) {
    const { accessToken, user } = await this.authService.verifyTokenAndLogin(
      dto.idToken,
    );
    return { accessToken, user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    // Stateless JWT — no server-side invalidation needed for MVP
    return { message: 'Logged out successfully' };
  }

  @Get('session')
  @UseGuards(AuthGuard)
  async getSession(@CurrentUser() user: User) {
    return { user };
  }
}
