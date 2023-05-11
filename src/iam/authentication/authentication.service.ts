import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto } from './dto/sign-up.dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name); // Logger
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    this.logger.debug(`Hitting up the SignUp method, Create a new User`);
    try {
      const user = new User();
      user.email = signUpDto.email;
      user.password = await this.hashingService.hash(signUpDto.password);

      await this.usersRepository.save(user);
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        this.logger.error(`User with email ${signUpDto.email} already exists`);
        throw new ConflictException();
      }
      throw err;
    }
  }

  async signIn(signInDto: SignInDto) {
    this.logger.debug(`Hitting up the SignIn method, Login a User`);
    const user = await this.usersRepository.findOneBy({
      email: signInDto.email,
    });
    if (!user) {
      this.logger.error(`User with email ${signInDto.email} does not exist`);
      throw new UnauthorizedException(`User does not exist`);
    }
    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );
    if (!isEqual) {
      this.logger.error(`Incorrect password`);
      throw new UnauthorizedException(`Password does not match`);
    }
    //todo here comes something in the next lesson
    return true;
  }
}
