import { Module } from '@nestjs/common';
import { WhoisController } from './whois.controller';
import { WhoisService } from './whois.service';

@Module({
  controllers: [WhoisController],
  providers: [WhoisService],
})
export class WhoisModule {}
