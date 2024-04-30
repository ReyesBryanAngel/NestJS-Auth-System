import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('login')
@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  async login(@Body() createLoginDto: CreateLoginDto) {
    const token = await this.loginService.login(createLoginDto);
    try {
      if (!token) {
        throw new HttpException(
          'Invalid User Credentials!.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      return {
        code: HttpStatus.OK,
        message: 'Login Successfully!.',
        access_token: token,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(error.response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
