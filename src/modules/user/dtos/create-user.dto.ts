import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/enums/user-role';

export class CreateUserDto {
  @ApiProperty({ example: 'testing1@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'testing' })
  @IsString()
  first_name: string;

  @ApiProperty({ example: 'testing last name' })
  @IsString()
  last_name: string;

  @ApiProperty({ example: 'testing' })
  @IsString()
  password: string;

  @ApiProperty({ example: Role.CLIENT })
  @IsEnum(Role)
  @IsOptional()
  role: Role;
}
