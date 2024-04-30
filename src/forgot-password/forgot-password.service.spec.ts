import { Test, TestingModule } from '@nestjs/testing';
import { ForgotPasswordService } from './forgot-password.service';
import { DRIZZLE_ORM } from '../core/constants/db.constants';
import { UsersService } from '../users/users.service';
import { CreateForgotPasswordDto } from './dto/create-forgot-password.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ForgotPasswordService', () => {
  let service: ForgotPasswordService;
  let mockDb: any;
  let usersService: Partial<UsersService>;

  beforeEach(async () => {
    mockDb = {
      update: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      query: {
        resetPasswordTokens: {
          findFirst: jest.fn(),
        },
      },
    };

    usersService = {
      findUser: jest.fn() as jest.Mock,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForgotPasswordService,
        {
          provide: DRIZZLE_ORM,
          useValue: mockDb,
        },
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();

    service = module.get<ForgotPasswordService>(ForgotPasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('forgotPassword', () => {
    it('should throw an exception if user has reset password recently', async () => {
      const currentTime = new Date();
      const recentTime = new Date(currentTime.getTime() - 2 * 60 * 1000); // 2 minutes ago
      const createForgotPasswordDto: CreateForgotPasswordDto = {
        email: 'test@example.com',
        isUsed: true,
        otp: '572812',
        createdAt: currentTime,
        updatedAt: currentTime,
      };

      usersService.findUser = jest
        .fn()
        .mockResolvedValue(createForgotPasswordDto);

      service.findUserInResetPasswordTable = jest.fn().mockResolvedValue({
        updatedAt: recentTime,
      });

      jest
        .spyOn(global, 'Date')
        .mockImplementation(() => currentTime as unknown as Date);

      await expect(
        service.forgotPassword(createForgotPasswordDto),
      ).rejects.toThrowError(
        new HttpException(
          'Password has been changed recently. Please wait 5 minutes to request for a reset password again.',
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
      );
    });

    // it('should create a reset password token if user exists and has not reset password recently', async () => {
    //   const email = 'test@example.com';
    //   const currentTime = new Date();
    //   const recentTime = new Date(currentTime.getTime() - 10 * 60 * 1000); // 10 minutes ago
    //   const createForgotPasswordDto: CreateForgotPasswordDto = {
    //     email: 'test@example.com',
    //     isUsed: true,
    //     otp: '572812',
    //     createdAt: currentTime,
    //     updatedAt: currentTime,
    //   };

    //   usersService.findUser = jest
    //     .fn()
    //     .mockResolvedValue(createForgotPasswordDto);

    //   service.findUserInResetPasswordTable = jest.fn().mockResolvedValue(null); // User has not reset password recently

    //   jest
    //     .spyOn(global, 'Date')
    //     .mockImplementation(() => recentTime as unknown as Date); // Mock current time as recentTime

    //   const result = await service.forgotPassword(createForgotPasswordDto);

    //   // Assert that reset password token is created
    //   expect(result).toBeDefined();
    //   expect(mockDb.insert).toHaveBeenCalledWith(schema.resetPasswordTokens);
    //   expect(mockDb.insert().values).toHaveBeenCalledWith({
    //     email,
    //     createdAt: recentTime, // Assert that createdAt matches recentTime
    //   });
    // });

    it('should throw an error if user does not exist', async () => {
      const email = 'test@example.com';
      const createForgotPasswordDto: CreateForgotPasswordDto = {
        email: 'test@example.com',
        isUsed: false,
        otp: '572812',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      usersService.findUser = jest.fn().mockResolvedValue(email);

      await expect(
        service.forgotPassword(createForgotPasswordDto),
      ).rejects.toThrow();
    });

    it('should throw an error if user has reset password recently', async () => {
      const email = 'test@example.com';
      const createForgotPasswordDto: CreateForgotPasswordDto = {
        email: 'test@example.com',
        isUsed: false,
        otp: '572812',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      usersService.findUser = jest.fn().mockResolvedValue(email);

      mockDb.query.resetPasswordTokens.findFirst.mockResolvedValue(
        createForgotPasswordDto,
      );

      await expect(
        service.forgotPassword(createForgotPasswordDto),
      ).rejects.toThrow();
    });
  });
});
