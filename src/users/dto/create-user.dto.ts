import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';
import { Match } from '../../decorators/match.decorator';

export class CreateUserDto {
  userId?: number;

  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  lastname: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Match('password')
  confirm_password: string;

  @IsOptional()
  @IsString()
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: 'Invalid email format',
  })
  // @EitherOr() // Apply the custom decorator here
  email: string | null;

  @IsOptional()
  @IsString()
  @Matches(/^\d{11}$/, {
    message: 'Invalid mobile number format',
  })
  mobile: string | null;

  is_verified: boolean | null;
  mobileVerified: boolean | null;
  otp: string;
}
