import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service';
import { CreateForgotPasswordDto } from './dto/create-forgot-password.dto';
import { CaasService } from '../shared/caas.service';
import { UsersService } from '../users/users.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('forgot-password')
@Controller('users')
export class ForgotPasswordController {
  constructor(
    private readonly forgotPasswordService: ForgotPasswordService,
    private readonly caasService: CaasService,
    private readonly usersService: UsersService,
  ) {}

  @Post('forgot-password')
  async forgotPassword(
    @Body() createForgotPasswordDto: CreateForgotPasswordDto,
  ) {
    try {
      const { email } = createForgotPasswordDto;
      const isValidEmail = await this.forgotPasswordService.forgotPassword(
        createForgotPasswordDto,
      );
      if (!isValidEmail) {
        throw new HttpException(
          'User is not registered',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const caasResponse = await this.caasService.sendEmail({ email });

      return caasResponse;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('reset-password/:id')
  async resetPassword(
    @Body() createForgotPasswordDto: CreateForgotPasswordDto,
  ) {
    try {
      const { otp, email } = createForgotPasswordDto;
      const isUserExist = await this.usersService.findByEmail(email);

      if (!isUserExist) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      const verifyResult = await this.caasService.verifyEmail({
        email,
        otp,
      });

      if (verifyResult.code === HttpStatus.OK) {
        await this.forgotPasswordService.resetPassword(createForgotPasswordDto);
      }

      return verifyResult;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
