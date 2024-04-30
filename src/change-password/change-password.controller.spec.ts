import { Test, TestingModule } from '@nestjs/testing';
import { ChangePasswordController } from './change-password.controller';
import { ChangePasswordService } from './change-password.service';
import { DRIZZLE_ORM } from '../core/constants/db.constants';

describe('ChangePasswordController', () => {
  let controller: ChangePasswordController;

  beforeEach(async () => {
    let mockDb: any;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChangePasswordController],
      providers: [
        ChangePasswordService,
        {
          provide: DRIZZLE_ORM,
          useValue: mockDb,
        },
      ],
    }).compile();

    controller = module.get<ChangePasswordController>(ChangePasswordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
