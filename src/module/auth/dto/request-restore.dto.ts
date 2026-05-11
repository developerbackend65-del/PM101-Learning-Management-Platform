import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestRestoreDTO {
  @ApiProperty({
    description: 'Email address of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
