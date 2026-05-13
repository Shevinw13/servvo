import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceToken } from './device-token.entity';
import { NotificationPreference } from './notification-preference.entity';

interface RegisterDeviceDto {
  token: string;
  platform: string;
}

interface UpdatePreferencesDto {
  status_changes?: boolean;
  new_messages?: boolean;
  invoice_reminders?: boolean;
  review_requests?: boolean;
  appointment_confirmations?: boolean;
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(DeviceToken)
    private readonly deviceTokenRepo: Repository<DeviceToken>,
    @InjectRepository(NotificationPreference)
    private readonly prefsRepo: Repository<NotificationPreference>,
  ) {}

  async registerDevice(userId: string, dto: RegisterDeviceDto): Promise<DeviceToken> {
    // Upsert: update existing token or create new one
    const existing = await this.deviceTokenRepo.findOne({
      where: { user_id: userId, token: dto.token },
    });

    if (existing) {
      existing.last_used_at = new Date();
      return this.deviceTokenRepo.save(existing);
    }

    const deviceToken = this.deviceTokenRepo.create({
      user_id: userId,
      token: dto.token,
      platform: dto.platform,
    });

    return this.deviceTokenRepo.save(deviceToken);
  }

  async getPreferences(userId: string): Promise<NotificationPreference> {
    let prefs = await this.prefsRepo.findOne({
      where: { user_id: userId },
    });

    if (!prefs) {
      // Create default preferences
      prefs = this.prefsRepo.create({
        user_id: userId,
        status_changes: true,
        new_messages: true,
        invoice_reminders: true,
        review_requests: true,
        appointment_confirmations: true,
      });
      prefs = await this.prefsRepo.save(prefs);
    }

    return prefs;
  }

  async updatePreferences(
    userId: string,
    dto: UpdatePreferencesDto,
  ): Promise<NotificationPreference> {
    let prefs = await this.prefsRepo.findOne({
      where: { user_id: userId },
    });

    if (!prefs) {
      prefs = this.prefsRepo.create({
        user_id: userId,
        ...dto,
      });
    } else {
      Object.assign(prefs, dto);
    }

    return this.prefsRepo.save(prefs);
  }
}
