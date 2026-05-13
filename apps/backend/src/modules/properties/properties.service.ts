import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  async findAllByUser(userId: string): Promise<Property[]> {
    return this.propertyRepository.find({ where: { user_id: userId } });
  }

  async create(userId: string, dto: CreatePropertyDto): Promise<Property> {
    const property = this.propertyRepository.create({
      user_id: userId,
      ...dto,
    });
    return this.propertyRepository.save(property);
  }

  async update(
    userId: string,
    propertyId: string,
    dto: UpdatePropertyDto,
  ): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.user_id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this property',
      );
    }

    await this.propertyRepository.update(propertyId, dto);
    return this.propertyRepository.findOneOrFail({ where: { id: propertyId } });
  }
}
