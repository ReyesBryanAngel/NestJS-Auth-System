import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { IsNotEmpty } from 'class-validator';

export class IName {
  @IsNotEmpty()
  name: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
