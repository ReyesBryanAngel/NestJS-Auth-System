import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { HttpService } from '@nestjs/axios';
@Injectable()
export class WalletService {
  constructor(private httpService: HttpService) {}

  async generateToken(createWalletDto: CreateWalletDto) {
    const walletEmailEndpoint = process.env.WALLET_AUTH;
    const response = await this.httpService
      .post(walletEmailEndpoint, createWalletDto)
      .toPromise();

    return response.data;
  }
}
