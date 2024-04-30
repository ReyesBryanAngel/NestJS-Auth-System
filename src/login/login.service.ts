import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';
import { UsersService } from '../users/users.service';
import { JwtAuthService } from '../shared/jwt-auth.service';
import { compare } from 'bcrypt';

@Injectable()
export class LoginService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}
  private loginAttempts: Map<string, { attempts: number; lastAttempt: Date }> =
    new Map();

  private readonly maxLoginAttempts = 3;

  private readonly lockoutDuration = 10 * 60 * 1000;

  async login(createLoginDto: CreateLoginDto) {
    const { email, password, mobile } = createLoginDto;
    const user = email
      ? await this.usersService.findUser(email)
      : await this.usersService.findUserMobile(mobile);
    const credUsed = !email ? mobile : email;
    let userLogin = this.loginAttempts.get(credUsed);
    const lockedUser = this.loginAttempts.get(credUsed);

    if (
      new Date().getTime() - lockedUser?.lastAttempt.getTime() <
        this.lockoutDuration &&
      userLogin?.attempts >= this.maxLoginAttempts
    ) {
      throw new HttpException(
        'Account is locked. Please try again after 10 minutes.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!user || user.deleted || (!user.mobileVerified && !user.is_verified)) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    const passwordMatches = await compare(password, user?.password);

    if (
      !passwordMatches ||
      (email && (!user.is_verified || user.deleted)) ||
      (mobile && (!user.mobileVerified || user.deleted))
    ) {
      if (!userLogin) {
        userLogin = { attempts: 0, lastAttempt: new Date() };
        this.loginAttempts.set(credUsed, userLogin);
      } else {
        userLogin.attempts++;
        userLogin.lastAttempt = new Date();
      }

      if (userLogin?.attempts >= this.maxLoginAttempts) {
        throw new HttpException(
          'Account is locked. Please try again after 10 minutes.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      throw new HttpException(
        'Invalid User Credentials!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (userLogin?.attempts >= this.maxLoginAttempts) {
      throw new HttpException(
        'Account is locked. Please try again after 10 minutes.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = await this.jwtAuthService.generateToken(createLoginDto);

    if (token) {
      this.loginAttempts.delete(email);
      return token;
    }

    return token;
  }
}
