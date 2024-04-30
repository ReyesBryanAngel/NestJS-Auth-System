import { IsNotEmpty, IsString, IsOptional, Matches } from 'class-validator';
export class CreateLoginDto {
  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{11}$/, {
    message: 'Invalid mobile number format',
  })
  mobile: string | null;

  @IsNotEmpty()
  @IsString()
  password: string;
}
