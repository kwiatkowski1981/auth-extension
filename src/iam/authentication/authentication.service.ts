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
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name); // Logger
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @Inject(DataSource) private dataSource: DataSource,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
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
    const accessToken = await this.jwtService.signAsync(
      {
        // TODO co zamiast sub?
        //  Note: All HTML wrapper methods are deprecated and only standardized for compatibility purposes.
        //  Use DOM APIs such as document.createElement() instead.
        sub: user.id,
        email: user.email,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      },
    );
    return {
      accessToken,
    };
  }
}
