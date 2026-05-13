import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Property } from '../properties/property.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { OnboardingDto } from './dto/onboarding.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  async getProfile(userId: string): Promise<User> {
    return this.userRepository.findOneOrFail({ where: { id: userId } });
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<User> {
    await this.userRepository.update(userId, dto);
    return this.userRepository.findOneOrFail({ where: { id: userId } });
  }

  async completeOnboarding(
    userId: string,
    dto: OnboardingDto,
  ): Promise<{ user: User; property: Property }> {
    // Update user profile
    await this.userRepository.update(userId, {
      name: dto.name,
      ...(dto.email && { email: dto.email }),
      onboarding_complete: true,
    });

    // Create property
    const property = this.propertyRepository.create({
      user_id: userId,
      address_line1: dto.address_line1,
      address_line2: dto.address_line2,
      city: dto.city,
      state: dto.state,
      zip: dto.zip,
      details: dto.property_details ?? undefined,
    });

    const savedProperty = await this.propertyRepository.save(property);
    const updatedUser = await this.userRepository.findOneOrFail({
      where: { id: userId },
    });

    return { user: updatedUser, property: savedProperty };
  }

  async getOnboardingStatus(
    userId: string,
  ): Promise<{ onboardingComplete: boolean }> {
    const user = await this.userRepository.findOneOrFail({
      where: { id: userId },
    });
    return { onboardingComplete: user.onboarding_complete };
  }
}
