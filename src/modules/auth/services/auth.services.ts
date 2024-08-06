import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { UserService } from 'src/modules/user/services/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto) {
    const user = await this.userService.getUserbyEmail(loginDto.email);
    if (
      !user &&
      !(await bcrypt.compare(loginDto.password.toString(), user ? user.password : 'null'))
    )
      throw new UnauthorizedException('Invalid Email | password');
    const token = await this.jwtService.sign(
      { email: user.email, id: user.id },
      { secret: process.env.JWT_SECRET },
    );
    return {
      message: 'Login Successfull',
      token,
    };
  }
}
