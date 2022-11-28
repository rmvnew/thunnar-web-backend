import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileModule } from './../profile/profile.module';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ProfileModule
  ],
  controllers: [
    UserController
  ],
  providers: [UserService],
  exports:[UserService]
})
export class UserModule { }
