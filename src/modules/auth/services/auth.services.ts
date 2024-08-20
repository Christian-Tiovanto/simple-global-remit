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
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto) {
    const user = await this.userService.getUserbyEmail(loginDto.email);
    if (!user || !(await bcrypt.compare(loginDto.password.toString(), user ? user.password : 'null')))
      throw new UnauthorizedException('Invalid Email | password');
    const token = await this.jwtService.sign(
      { email: user.email, id: user.id, role: user.role },
      { secret: process.env.JWT_SECRET },
    );
    return {
      message: 'Login Successfull',
      token,
    };
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
    console.log(user);
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
