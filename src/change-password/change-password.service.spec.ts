import { Test, TestingModule } from '@nestjs/testing';
import { ChangePasswordService } from './change-password.service';
import { DRIZZLE_ORM } from '../core/constants/db.constants';
import { WalletService } from '../wallet/wallet.service';
import { HttpModule } from '@nestjs/axios';

describe('ChangePasswordService', () => {
  let service: ChangePasswordService;

  beforeEach(async () => {
    let mockDb: any;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangePasswordService,
        WalletService,
        {
          provide: DRIZZLE_ORM,
          useValue: mockDb,
        },
      ],
      imports: [HttpModule],
    }).compile();

    service = module.get<ChangePasswordService>(ChangePasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
