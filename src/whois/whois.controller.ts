import {
  Controller,
  Get,
  Query,
  BadRequestException,
  // Logger,
} from '@nestjs/common';
import { WhoisService } from './whois.service';

@Controller('whois')
export class WhoisController {
  // private readonly logger = new Logger(WhoisController.name);
  constructor(private readonly whoisService: WhoisService) {}

  @Get()
  async getWhois(@Query('domain') domain: string) {
    // this.logger.log(`Received WHOIS request for domain: ${domain}`);
    if (!domain) {
      throw new BadRequestException('Domain query parameter is required');
    }

    try {
      const data = await this.whoisService.lookup(domain);
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
