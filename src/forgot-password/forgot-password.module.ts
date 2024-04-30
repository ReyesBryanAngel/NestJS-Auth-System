import { Module } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordController } from './forgot-password.controller';
import { CaasService } from 'src/shared/caas.service';
import { UsersService } from 'src/users/users.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ForgotPasswordController],
  providers: [ForgotPasswordService, CaasService, UsersService],
})
export class ForgotPasswordModule {}
