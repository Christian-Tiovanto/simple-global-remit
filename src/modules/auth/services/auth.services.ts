import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { UserService } from 'src/modules/user/services/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { generateOtpAndSecret } from 'src/utils/otp-generator';
import { CreateUserDto } from 'src/modules/user/dtos/create-user.dto';
import { sendMail } from 'src/utils/send-mail';
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
    const { otp, secret } = generateOtpAndSecret();
    createUserDto.otp_secret_key = secret;
    const user = await this.userService.createUser(createUserDto);
    sendMail(createUserDto.email, 'Your OTP Verification Code', otp);
    return user;
  }
}
