import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class CaasService {
  constructor(private httpService: HttpService) {}

  async sendEmail(data: { email: string }) {
    const walletEmailEndpoint = process.env.OTP_EMAIL;
    const response = await this.httpService
      .post(walletEmailEndpoint, data, {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      })
      .toPromise();
    return response.data;
  }

  async registerMobile(data: { mobile: string }) {
    const walletSmsEndpoint = process.env.OTP_MOBILE;
    const response = await this.httpService
      .post(walletSmsEndpoint, data, {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      })
      .toPromise();

    return response.data;
  }

  async verifyMobile(data: { otp: string; mobile: string }) {
    const walletEmailEndpoint = process.env.OTP_MOBILE_VERIFY;
    const response = await this.httpService
      .post(walletEmailEndpoint, data, {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      })
      .toPromise();

    return response.data;
  }

  async verifyEmail(data: { otp: string; email: string }) {
    const walletEmailEndpoint = process.env.OTP_EMAIL_VERIFY;
    const response = await this.httpService
      .post(walletEmailEndpoint, data, {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      })
      .toPromise();

    return response.data;
  }
}
