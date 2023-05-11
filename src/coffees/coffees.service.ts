import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class CoffeesService {
  private readonly logger = new Logger(CoffeesService.name); // Logger
  constructor(@Inject(DataSource) private dataSource: DataSource) {} // DB connection in constructor
  create(createCoffeeDto: CreateCoffeeDto) {
    return 'This action adds a new coffee';
  }

  findAll() {
    return `This action returns all coffees`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coffee`;
  }

  update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
    return `This action updates a #${id} coffee`;
  }

  remove(id: number) {
    return `This action removes a #${id} coffee`;
  }
}
