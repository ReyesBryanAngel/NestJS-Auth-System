import { Controller, Post, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('caas-client')
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('auth')
  async generateClientToken(@Body() createWalletDto: CreateWalletDto) {
    const accessToken = await this.walletService.generateToken(createWalletDto);
    process.env.ACCESS_TOKEN = accessToken.access_token;

    return accessToken;
  }
}
