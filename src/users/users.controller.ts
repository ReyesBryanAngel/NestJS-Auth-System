import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CaasService } from '../shared/caas.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';

interface CustomRequest extends Request {
  decodedData?: {
    email: string;
    mobile: string;
  };
}
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private caasService: CaasService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const isUserExist = await this.usersService.findByEmail(email);

    if (!isUserExist) {
      const caasResponse = await this.caasService.sendEmail({ email });
      if (caasResponse.code === HttpStatus.OK) {
        await this.usersService.register(createUserDto);

        return caasResponse;
      }
    } else if (
      isUserExist &&
      (!isUserExist.is_verified || isUserExist.deleted)
    ) {
      const caasResponse = await this.caasService.sendEmail({ email });
      if (caasResponse.code === HttpStatus.OK) {
        await this.usersService.registerFromUpdate(createUserDto);
      }

      return caasResponse;
    } else {
      throw new HttpException(
        'User is registered already',
        HttpStatus.CONFLICT,
      );
    }
  }

  @Put('verify-email/:id')
  async verify(
    @Param('id') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const { otp, email } = updateUserDto;
      const isIdExist = await this.usersService.findById(userId);

      if (!isIdExist && isIdExist.email !== email) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      if (isIdExist.email && isIdExist.is_verified) {
        throw new HttpException(
          'User is registered already',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      const verifyResult = await this.caasService.verifyEmail({
        email,
        otp,
      });

      if (verifyResult.code === HttpStatus.OK) {
        await this.usersService.updateIsVerify(userId);
      }

      return verifyResult;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('register-mobile/:id')
  async registerMobile(
    @Param('id') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const isIdExist = await this.usersService.findById(userId);
    const { mobile } = updateUserDto;

    if (!isIdExist) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
    try {
      const caasMobileResponse = await this.caasService.registerMobile({
        mobile,
      });

      if (caasMobileResponse.code === HttpStatus.OK) {
        await this.usersService.updateProfile(userId, updateUserDto);

        return caasMobileResponse;
      }
    } catch (error) {
      console.error(error);
      throw new HttpException(error.response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('verify-mobile/:id')
  async verifyMobile(
    @Param('id') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const { otp, mobile } = updateUserDto;
      const isIdExist = await this.usersService.findById(userId);

      if (!isIdExist || isIdExist.mobile !== mobile) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      if (isIdExist.mobile && isIdExist.mobileVerified) {
        throw new HttpException(
          'User is registered already',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      const verifyResult = await this.caasService.verifyMobile({
        mobile,
        otp,
      });

      if (verifyResult.code === HttpStatus.OK) {
        await this.usersService.updateIsMobileVerify(userId);
      }

      return verifyResult;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard)
  @Put('update-profile/:id')
  async updateProfile(
    @Param('id') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const isIdExist = await this.usersService.findById(userId);

    if (
      !isIdExist ||
      isIdExist.deleted ||
      (!isIdExist.mobileVerified && !isIdExist.is_verified)
    ) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    await this.usersService.updateProfile(userId, updateUserDto);

    return {
      code: HttpStatus.OK,
      status: 'success',
      message: 'User Updated Successfully',
    };
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserById(@Param('id') userId: number) {
    const isIdExist = await this.usersService.findById(userId);

    if (
      !isIdExist ||
      isIdExist.deleted ||
      (!isIdExist.mobileVerified && !isIdExist.is_verified)
    ) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    const userDetails = {
      userId: isIdExist.userId,
      firstname: isIdExist.firstname,
      lastname: isIdExist.lastname,
      email: isIdExist.email,
      mobile: isIdExist.mobile,
      is_verified: isIdExist.is_verified,
    };

    return userDetails;
  }

  @UseGuards(AuthGuard)
  @Get('registered/profile')
  async getProfile(@Req() req: CustomRequest) {
    const user = !req.decodedData.email
      ? req.decodedData.mobile
      : req.decodedData.email;
    const isUserExist = await this.usersService.findByEmail(user);

    if (
      !isUserExist ||
      isUserExist.deleted ||
      (!isUserExist.mobileVerified && !isUserExist.is_verified)
    ) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    const userDetails = {
      userId: isUserExist.userId,
      firstname: isUserExist.firstname,
      lastname: isUserExist.lastname,
      email: isUserExist.email,
      mobile: isUserExist.mobile,
      is_verified: isUserExist.is_verified,
      mobileVerified: isUserExist.mobileVerified,
    };

    return userDetails;
  }

  @UseGuards(AuthGuard)
  @Delete('remove/:id')
  async removeUser(@Param('id') userId: number) {
    const isIdExist = await this.usersService.findById(userId);

    if (
      !isIdExist ||
      isIdExist.deleted ||
      (!isIdExist.mobileVerified && !isIdExist.is_verified)
    ) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    await this.usersService.removeUser(userId);

    return {
      code: HttpStatus.OK,
      status: 'success',
      message: 'User Delete Successfully.',
    };
  }
}
