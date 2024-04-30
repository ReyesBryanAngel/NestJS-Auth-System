import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { JwtAuthService } from '../shared/jwt-auth.service';
import { UsersService } from '../users/users.service';
import { DRIZZLE_ORM } from '../core/constants/db.constants';

describe('LoginController', () => {
  let controller: LoginController;

  beforeEach(async () => {
    let mockDb: any;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        LoginService,
        UsersService,
        {
          provide: JwtAuthService,
          useClass: jest.fn(() => ({ generateToken: jest.fn() })),
        },
        {
          provide: DRIZZLE_ORM,
          useValue: mockDb,
        },
      ],
    }).compile();

    controller = module.get<LoginController>(LoginController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
