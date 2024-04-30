import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DRIZZLE_ORM } from '../core/constants/db.constants';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CaasService } from '../shared/caas.service';
import { HttpModule } from '@nestjs/axios';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    let mockDb: any;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        AuthService,
        JwtService,
        CaasService,
        {
          provide: DRIZZLE_ORM,
          useValue: mockDb,
        },
      ],
      imports: [HttpModule],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
