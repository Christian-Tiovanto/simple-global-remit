import { User } from 'src/modules/user/models/user.entity';

export type JwtPayload = Pick<User, 'email' | 'is_verified' | 'role' | 'id'>;
