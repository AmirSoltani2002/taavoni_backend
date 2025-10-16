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
  IsBoolean,
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
  @IsOptional()
  birthDay?: Date;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  address?: string;
  @IsPhoneNumber('IR')
  @IsNotEmpty()
  @IsOptional()
  homePhone?: string;
  @IsPhoneNumber('IR')
  @IsNotEmpty()
  @IsOptional()
  mobile?: string;
  @IsPhoneNumber('IR')
  @IsNotEmpty()
  @IsOptional()
  workPhone?: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty({ message: 'National number is required' })
  nationalNumber: string;
  @IsEnum(TYPE)
  @IsNotEmpty()
  @IsOptional()
  type?: TYPE;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsEnum(ISARGARIPERCENT)
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
  @IsEnum(SHAHEDRELATION)
  @IsOptional()
  shahedRelation?: SHAHEDRELATION;
  @IsBoolean()
  @IsOptional()
  accepted?: boolean;
}
