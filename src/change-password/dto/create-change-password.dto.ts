import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Match } from '../../decorators/match.decorator';

export class CreateChangePasswordDto {
  otp: string;
  isUsed: boolean;
  updatedAt: Date;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;

  @Match('password')
  @IsNotEmpty()
  confirmPassword: string;
}
