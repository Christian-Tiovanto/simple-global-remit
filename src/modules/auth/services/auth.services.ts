import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { UserService } from 'src/modules/user/services/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/modules/user/dtos/create-user.dto';
import { generateOtpAndSecret } from 'src/utils/otp-generator';
import { sendMail } from 'src/utils/send-mail';
import { authenticator } from 'otplib';
import { VerifyUserDto } from '../dtos/verify-user.dto';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { UserNotificationService } from 'src/modules/user-notification-token/services/user-notification.service';
import { CreateUserNotificationDto } from 'src/modules/user-notification-token/dtos/create-user-notification.dto';
import { User } from 'src/modules/user/models/user.entity';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly userNotificationService: UserNotificationService,
  ) {}
  async login(loginDto: LoginDto) {
    const user = await this.userService.getUserbyEmail(loginDto.email);
    if (!user || !(await bcrypt.compare(loginDto.password.toString(), user ? user.password : 'null')))
      throw new UnauthorizedException('Invalid Email | password');
    const payload: JwtPayload = {
      email: user.email,
      id: user.id,
      role: user.role,
      is_verified: user.is_verified,
    };
    const token = await this.jwtService.sign(payload, { secret: process.env.JWT_SECRET });
    await this.createUserNotificationLogin(user.id, loginDto.token);
    return {
      message: 'Login Successfull',
      token,
    };
  }

  private async createUserNotificationLogin(id: User['id'], token: LoginDto['token']) {
    const userNotificationDto: CreateUserNotificationDto = {
      user_id: id,
      token: token,
    };
    await this.userNotificationService.createUserNotificationToken(userNotificationDto);
  }
  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return user;
  }

  async getOtp(email: string) {
    const user = await this.userService.getUserbyEmail(email);
    const { otp, secret } = generateOtpAndSecret();
    user.otp_secret_key = secret;
    await this.userService.saveUser(user);
    sendMail(email, 'Your OTP Verification Code', otp);
    return { otp };
  }

  async verifyUser(email: string, verifyUserDto: VerifyUserDto) {
    const { otp } = verifyUserDto;
    const user = await this.userService.getUserbyEmail(email);
    const isValid = authenticator.check(otp, user.otp_secret_key);
    if (!isValid) throw new BadRequestException('invalid OTP Code');
    user.is_verified = true;
    await this.userService.saveUser(user);
    return { message: 'Verification successfull' };
  }
}
