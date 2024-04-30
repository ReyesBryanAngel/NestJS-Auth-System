import { HttpStatus, HttpException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { CaasService } from '../shared/caas.service';
import { UsersService } from './users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { DRIZZLE_ORM } from '../core/constants/db.constants';
import { HttpModule, HttpService } from '@nestjs/axios';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '../auth/auth.guard';
import { JwtAuthService } from '../shared/jwt-auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  let caasService: CaasService;
  // let jwtAuthService: JwtAuthService;

  beforeEach(async () => {
    const mockDb = {
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        CaasService,
        AuthGuard,
        AuthService,
        JwtAuthService,
        {
          provide: UsersService,
          useValue: {
            register: jest.fn(),
            findByEmail: jest.fn(),
            registerFromUpdate: jest.fn(),
          },
        },
        {
          provide: DRIZZLE_ORM,
          useValue: mockDb,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
      imports: [HttpModule, JwtModule],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    caasService = module.get<CaasService>(CaasService);
    // jwtAuthService = module.get<JwtAuthService>(JwtAuthService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      usersService.findByEmail = jest.fn().mockResolvedValue(null);

      caasService.sendEmail = jest
        .fn()
        .mockResolvedValue({ code: HttpStatus.OK });

      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        confirm_password: 'password',
        firstname: '',
        lastname: '',
        mobile: '',
        is_verified: false,
        mobileVerified: false,
        otp: '',
      };

      const response = await controller.register(createUserDto);

      expect(response.code).toEqual(HttpStatus.OK);
      expect(usersService.register).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw conflict error if user is already registered', async () => {
      const existingUser: any = {
        email: 'test@example.com',
        password: 'password',
        confirm_password: 'password',
        firstname: 'BryanTest',
        lastname: 'ReyesTest',
        mobile: '09263124214',
        is_verified: true,
        mobileVerified: true,
        otp: '123456',
      };
      usersService.findByEmail = jest.fn().mockResolvedValue(existingUser);

      const createUserDto: CreateUserDto = {
        firstname: '',
        lastname: '',
        password: '',
        confirm_password: '',
        email: '',
        mobile: '',
        is_verified: false,
        mobileVerified: false,
        otp: '',
      };

      await expect(controller.register(createUserDto)).rejects.toThrowError(
        HttpException,
      );
      await expect(controller.register(createUserDto)).rejects.toThrowError(
        'User is registered already',
      );

      expect(usersService.register).not.toHaveBeenCalled();
    });

    it('should register a user with unverified email', async () => {
      const existingUser: any = {
        email: 'test@example.com',
        password: 'password',
        confirm_password: 'password',
        firstname: 'BryanTest',
        lastname: 'ReyesTest',
        mobile: '09263124214',
        is_verified: false,
        mobileVerified: true,
        otp: '',
      };
      usersService.findByEmail = jest.fn().mockResolvedValue(existingUser);
      caasService.sendEmail = jest
        .fn()
        .mockResolvedValue({ code: HttpStatus.OK });

      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        confirm_password: 'password',
        firstname: 'BryanTest',
        lastname: 'ReyesTest',
        mobile: '09263124214',
        is_verified: false,
        mobileVerified: true,
        otp: '',
      };

      const response = await controller.register(createUserDto);

      expect(response.code).toEqual(HttpStatus.OK);

      expect(usersService.registerFromUpdate).toHaveBeenCalledWith(
        createUserDto,
      );
    });
  });
});
