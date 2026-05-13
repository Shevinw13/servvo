import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { OnboardingDto } from './dto/onboarding.dto';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@CurrentUser() user: User) {
    return this.usersService.getProfile(user.id);
  }

  @Put('me')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateProfile(
    @CurrentUser() user: User,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Post('me/onboarding')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async completeOnboarding(
    @CurrentUser() user: User,
    @Body() dto: OnboardingDto,
  ) {
    return this.usersService.completeOnboarding(user.id, dto);
  }

  @Get('me/onboarding-status')
  async getOnboardingStatus(@CurrentUser() user: User) {
    return this.usersService.getOnboardingStatus(user.id);
  }
}
