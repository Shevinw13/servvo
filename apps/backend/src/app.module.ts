import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database/database.module';
import { RedisModule } from './config/redis/redis.module';
import { QueueModule } from './config/queue/queue.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { BusinessesModule } from './modules/businesses/businesses.module';
import { MediaModule } from './modules/media/media.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { ServiceStatusModule } from './modules/service-status/service-status.module';
import { MessagesModule } from './modules/messages/messages.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    DatabaseModule,
    RedisModule,
    QueueModule,
    AuthModule,
    UsersModule,
    PropertiesModule,
    BusinessesModule,
    MediaModule,
    AppointmentsModule,
    ServiceStatusModule,
    MessagesModule,
    InvoicesModule,
    PaymentsModule,
    ReviewsModule,
    BookingsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
