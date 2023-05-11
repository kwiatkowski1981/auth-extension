import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
// import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    {
      // Kazde uzycie service HashingService wskazuje na BcryptService,
      // jesli kiedykolwiek zechce zmienic metode hashowania wystarczy, ze utworze nowy serwis np HmacService.
      provide: HashingService,
      useClass: BcryptService, // 👈
    },
    AuthenticationService,
  ],
  controllers: [AuthenticationController],
})
export class IamModule {}
