import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { DRIZZLE_ORM } from '../core/constants/db.constants';
import { HttpModule } from '@nestjs/axios';

describe('WalletService', () => {
  let service: WalletService;

  beforeEach(async () => {
    let mockDb: any;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: DRIZZLE_ORM,
          useValue: mockDb,
        },
      ],
      imports: [HttpModule],
    }).compile();

    service = module.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
