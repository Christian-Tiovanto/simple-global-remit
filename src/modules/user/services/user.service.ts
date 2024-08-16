import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from '../models/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ErrorCode } from 'src/enums/error-code';
import { DuplicateEmailException } from 'src/exceptions/duplicate-email.exception';
import { plainToInstance } from 'class-transformer';
import { Role } from 'src/enums/user-role';

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
      if (!user.id) throw new BadRequestException('User Create Failed');
      return plainToInstance(User, user);
    } catch (err) {
      if (err instanceof QueryFailedError && err.driverError.code === ErrorCode.POSTGRES_UNIQUE_VIOLATION_ERROR_CODE) {
        throw new DuplicateEmailException(`${userDto.email} already register`, { key: 'email', value: userDto.email });
      }
      throw err;
    }
  }

  async getAllUser(role: Role): Promise<User[]> {
    try {
      const users = await this.usersRepository.find({ where: { ...(role ? { role } : {}) } });
      return plainToInstance(User, users);
    } catch (err) {
      if (err instanceof QueryFailedError && err.driverError.code === '22P02')
        throw new BadRequestException('there is no role like that');
      throw err;
    }
  }

  async getUserbyEmail(email: string): Promise<User> | undefined {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user;
  }

  async getUserbyId(id: number): Promise<User> | undefined {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException('there is no user with that id');
    return plainToInstance(User, user);
  }
}
