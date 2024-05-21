import { Test, TestingModule } from '@nestjs/testing';
import { WhoisService } from './whois.service';

describe('WhoisService', () => {
  let service: WhoisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhoisService],
    }).compile();

    service = module.get<WhoisService>(WhoisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
