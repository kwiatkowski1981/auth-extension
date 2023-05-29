import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class CoffeesService {
  private readonly logger = new Logger(CoffeesService.name);
  constructor(@Inject(DataSource) private dataSource: DataSource) {}
  create(createCoffeeDto: CreateCoffeeDto) {
    return 'This action adds a new coffee';
  }

  findAll() {
    this.logger.debug('hit the GET all coffees');
    return `This action returns all coffees`;
  }

  findOne(id: number) {
    this.logger.debug(`hit the GET a coffee with the ID: ${id})`);
    return `This action returns a coffee with ID: ${id}`;
  }

  update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
    return `This action updates a #${id} coffee`;
  }

  remove(id: number) {
    return `This action removes a #${id} coffee`;
  }
}
