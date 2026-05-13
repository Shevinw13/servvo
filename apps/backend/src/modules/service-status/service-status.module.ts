import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../appointments/appointment.entity';
import { ServiceStatusEvent } from './service-status-event.entity';
import { ServiceStatusController } from './service-status.controller';
import { ServiceStatusService } from './service-status.service';
import { ServiceStatusGateway } from './service-status.gateway';
import { AuthModule } from '../auth/auth.module';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, ServiceStatusEvent]),
    AuthModule,
    forwardRef(() => MessagesModule),
  ],
  controllers: [ServiceStatusController],
  providers: [ServiceStatusService, ServiceStatusGateway],
  exports: [ServiceStatusService],
})
export class ServiceStatusModule {}
