import { Test, TestingModule } from '@nestjs/testing';
import { WhoisController } from './whois.controller';

describe('WhoisController', () => {
  let controller: WhoisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WhoisController],
    }).compile();

    controller = module.get<WhoisController>(WhoisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
