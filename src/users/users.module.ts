import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CaasService } from 'src/shared/caas.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [HttpModule],
  controllers: [UsersController],
  providers: [UsersService, CaasService, AuthService, JwtService],
})
export class UsersModule {}
