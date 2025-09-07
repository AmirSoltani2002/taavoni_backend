import { ApiProperty } from '@nestjs/swagger';
import { TYPE, ISARGARIPERCENT, SEX, SHAHEDRELATION } from '@prisma/client';
import {
  IsString,
  IsEnum,
  IsDate,
  IsPhoneNumber,
  IsNumber,
  Min,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';
export class CreateUserDto {
  @IsString()
  name: string;
  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;
  @IsEnum(SEX)
  @IsNotEmpty()
  sex: SEX;
  @IsDate()
  @IsNotEmpty()
  birthDay: Date;
  @IsString()
  @IsNotEmpty()
  address: string;
  @IsPhoneNumber('IR')
  @IsNotEmpty()
  homePhone: string;
  @IsPhoneNumber('IR')
  @IsNotEmpty()
  mobile: string;
  @IsPhoneNumber('IR')
  @IsNotEmpty()
  workPhone: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty({ message: 'National number is required' })
  nationalNumber: string;
  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  nationalCard: string;
  @IsEnum(TYPE)
  @IsNotEmpty()
  type: TYPE;
  @IsString()
  @IsStrongPassword()
  password: string;
  @IsEnum([])
  @IsOptional()
  isargaryPercent?: ISARGARIPERCENT;
  @IsNumber()
  @IsOptional()
  @Min(0)
  azadeEsaratMonths?: number;
  @IsNumber()
  @IsOptional()
  @Min(0)
  azadeMonths?: number;
  @IsNumber()
  @IsOptional()
  @Min(0)
  shahedFamilyNumber?: number;
  @IsEnum([SHAHEDRELATION])
  @IsOptional()
  shahedRelation?: SHAHEDRELATION;
}
