import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ServiceStatusService } from './service-status.service';

/**
 * DTO representing an incoming Twilio SMS webhook payload.
 * Only the fields we use are typed here.
 */
interface TwilioSmsWebhookBody {
  Body: string;
  From: string;
  To: string;
  /** Custom field: appointment ID passed via Twilio's status callback URL */
  AppointmentId?: string;
}

@Controller()
export class ServiceStatusController {
  constructor(private readonly serviceStatusService: ServiceStatusService) {}

  /**
   * GET /appointments/:id/status
   * Returns current status and status history for an appointment.
   */
  @Get('appointments/:id/status')
  @UseGuards(AuthGuard)
  async getStatus(@Param('id') appointmentId: string) {
    return this.serviceStatusService.getStatus(appointmentId);
  }

  /**
   * POST /service-status/webhook/sms
   * Twilio webhook endpoint for SMS-based status updates from providers.
   * Public endpoint (Twilio signature validation can be added later).
   *
   * SMS reply mapping:
   *   "1" → on_the_way
   *   "2" → arrived
   *   "3" → completed
   */
  @Post('service-status/webhook/sms')
  @HttpCode(200)
  async handleSmsWebhook(@Body() body: TwilioSmsWebhookBody) {
    const smsBody = body.Body;
    const appointmentId = body.AppointmentId;

    if (!appointmentId) {
      throw new BadRequestException('AppointmentId is required');
    }

    const newStatus = ServiceStatusService.parseSmsStatus(smsBody);

    if (!newStatus) {
      // Unrecognized SMS reply — acknowledge but do nothing
      return { message: 'Unrecognized status code', received: smsBody };
    }

    const result = await this.serviceStatusService.updateStatus(
      appointmentId,
      newStatus,
    );

    return {
      message: 'Status updated',
      appointmentId: result.appointmentId,
      status: result.status,
    };
  }
}
