import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/enums/user-role';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
