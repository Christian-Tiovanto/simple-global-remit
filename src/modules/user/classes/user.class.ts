import { OmitType } from '@nestjs/swagger';
import { User } from '../models/user.entity';
import { Role } from 'src/enums/user-role';

export class CreateUserResponse extends OmitType(User, ['password'] as const) {}

export class GetUserResponse extends OmitType(User, ['password'] as const) {}

export class GetAllUserQuery {
  role: Role;
}
