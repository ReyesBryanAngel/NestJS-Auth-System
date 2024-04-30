import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ChangePasswordService } from './change-password.service';
import { CreateChangePasswordDto } from './dto/create-change-password.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('change-password')
@Controller('users')
export class ChangePasswordController {
  constructor(private readonly changePasswordService: ChangePasswordService) {}

  @Post('change-password')
  async changePassword(
    @Body() createChangePasswordDto: CreateChangePasswordDto,
  ) {
    try {
      const result = await this.changePasswordService.changePassword(
        createChangePasswordDto,
      );
      return result;
    } catch (error) {
      throw new HttpException(error.response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
