import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { HttpModule } from '@nestjs/axios';
import { CaasService } from 'src/shared/caas.service';

@Module({
  imports: [HttpModule],
  controllers: [WalletController],
  providers: [WalletService, CaasService],
})
export class WalletModule {}
