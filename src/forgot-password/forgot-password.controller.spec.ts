import { Test, TestingModule } from '@nestjs/testing';
import { ForgotPasswordController } from './forgot-password.controller';
import { ForgotPasswordService } from './forgot-password.service';
import { DRIZZLE_ORM } from '../core/constants/db.constants';
import { UsersService } from '../users/users.service';
import { CaasService } from '../shared/caas.service';
import { HttpModule } from '@nestjs/axios';

describe('ForgotPasswordController', () => {
  let controller: ForgotPasswordController;

  beforeEach(async () => {
    let mockDb: any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForgotPasswordController],
      providers: [
        UsersService,
        ForgotPasswordService,
        CaasService,
        {
          provide: DRIZZLE_ORM,
          useValue: mockDb,
        },
      ],
      imports: [HttpModule],
    }).compile();

    controller = module.get<ForgotPasswordController>(ForgotPasswordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
