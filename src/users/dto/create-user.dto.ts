import { TYPE, ISARGARIPERCENT, SEX, SHAHEDRELATION } from '@prisma/client';
import {
  IsString,
  IsEnum,
  IsDate,
  IsPhoneNumber,
  IsNumber,
  Min,
  IsEmail,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;
  @IsString()
  lastName: string;
  @IsEnum(SEX)
  sex: SEX;
  @IsDate()
  @IsOptional()
  birthDay?: Date;
  @IsString()
  @IsOptional()
  address?: string;
  @IsPhoneNumber('IR')
  @IsOptional()
  homePhone?: string;
  @IsPhoneNumber('IR')
  @IsOptional()
  mobile?: string;
  @IsPhoneNumber('IR')
  @IsOptional()
  workPhone?: string;
  @IsEmail()
  email: string;
  @IsString()
  nationalNumber: string;
  @IsEnum(TYPE)
  @IsOptional()
  type?: TYPE;
  @IsString()
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
