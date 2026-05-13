import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { AppointmentsService } from './appointments.service';
import { QueryAppointmentsDto } from './dto/query-appointments.dto';
import { RescheduleDto } from './dto/reschedule.dto';

@Controller('appointments')
@UseGuards(AuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async findAll(
    @CurrentUser() user: User,
    @Query() query: QueryAppointmentsDto,
  ) {
    const page = query.page ? parseInt(query.page, 10) : 1;
    const limit = query.limit ? parseInt(query.limit, 10) : 20;
    return this.appointmentsService.findAll(user.id, query.filter, page, limit);
  }

  @Get('next')
  async findNext(@CurrentUser() user: User) {
    return this.appointmentsService.findNextUpcoming(user.id);
  }

  @Get(':id')
  async findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.appointmentsService.findById(user.id, id);
  }

  @Post(':id/reschedule')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async reschedule(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: RescheduleDto,
  ) {
    return this.appointmentsService.reschedule(user.id, id, dto);
  }

  @Post(':id/cancel')
  async cancel(@CurrentUser() user: User, @Param('id') id: string) {
    return this.appointmentsService.cancel(user.id, id);
  }
}
