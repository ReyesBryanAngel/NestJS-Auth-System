import { IsNotEmpty, IsString } from 'class-validator';

export class CreateForgotPasswordDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  otp: string;
  isUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
