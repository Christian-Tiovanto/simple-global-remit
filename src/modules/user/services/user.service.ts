import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from '../models/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ErrorCode } from 'src/enums/error-code';
import { DuplicateEmailException } from 'src/exceptions/duplicate-email.exception';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(userDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.usersRepository.create(userDto);
      await this.usersRepository.save(user);
      if (!user.id) throw new HttpException('User Create Failed', HttpStatus.BAD_REQUEST);
      user.password = '';
      return plainToInstance(User, user);
    } catch (err) {
      if (
        err instanceof QueryFailedError &&
        err.driverError.code === ErrorCode.POSTGRES_UNIQUE_VIOLATION_ERROR_CODE
      ) {
        throw new DuplicateEmailException(
          `${userDto.email} already register`,
          'email',
          userDto.email,
        );
      }
      throw err;
    }
  }

  async getAllUser(): Promise<User[]> {
    const users = await this.usersRepository.find();

    return plainToInstance(User, users);
  }

  async getUserbyEmail(email: string): Promise<User> | undefined {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user;
  }
}
