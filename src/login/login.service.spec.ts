import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from './login.service';
import { UsersService } from '../users/users.service';
import { JwtAuthService } from '../shared/jwt-auth.service';
import { HttpException } from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';
import { DRIZZLE_ORM } from '../core/constants/db.constants';
import * as bcrypt from 'bcrypt';

describe('LoginService', () => {
  let service: LoginService;
  let usersService: UsersService;
  let jwtAuthService: JwtAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        UsersService,
        {
          provide: JwtAuthService,
          useClass: jest.fn(() => ({ generateToken: jest.fn() })),
        },
        {
          provide: DRIZZLE_ORM,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get(LoginService);
    usersService = module.get(UsersService);
    jwtAuthService = module.get(JwtAuthService);
  });

  it('should return token for valid credentials', async () => {
    const user = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      is_verified: true,
    };

    usersService.findUser = jest.fn().mockResolvedValue(user);

    const mockToken = 'mockToken';
    jwtAuthService.generateToken = jest.fn().mockResolvedValue(mockToken);

    const createLoginDto: CreateLoginDto = {
      email: 'test@example.com',
      password: 'password',
      mobile: '',
    };

    const compareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const token = await service.login(createLoginDto);

    expect(token).toEqual(mockToken);

    expect(compareSpy).toHaveBeenCalledWith(
      createLoginDto.password,
      user.password,
    );

    compareSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should throw 404 if user is not found', async () => {
      const createLoginDto: CreateLoginDto = {
        email: 'test@example.com',
        password: 'password',
        mobile: '',
      };

      usersService.findUser = jest.fn().mockResolvedValue(null);

      await expect(service.login(createLoginDto)).rejects.toThrow(
        HttpException,
      );
      await expect(service.login(createLoginDto)).rejects.toThrowError(
        'User not found!',
      );
    });
  });
});
