import {
  FRONTPRESENCETYPE,
  ISARGARRELATION,
  ISARGARYTYPE,
  MARTYRRELATION,
  SEX,
  TYPE,
} from '@prisma/client';
import {
  IsString,
  IsEnum,
  IsDate,
  IsPhoneNumber,
  IsInt,
  IsIn,
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
  @IsOptional()
  email?: string;
  @IsString()
  nationalNumber: string;
  @IsEnum(TYPE)
  @IsOptional()
  type?: TYPE;
  @IsString()
  password: string;
  @IsEnum(ISARGARYTYPE)
  @IsOptional()
  isargaryType?: ISARGARYTYPE;
  @IsEnum(MARTYRRELATION)
  @IsOptional()
  martyrRelation?: MARTYRRELATION | null;
  @IsEnum(ISARGARRELATION)
  @IsOptional()
  isargarRelation?: ISARGARRELATION | null;
  @IsInt()
  @IsIn(Array.from({ length: 16 }, (_, index) => (index + 1) * 5))
  @IsOptional()
  janbaziPercent?: number | null;
  @IsInt()
  @Min(1)
  @IsOptional()
  captivityMonths?: number | null;
  @IsEnum(FRONTPRESENCETYPE)
  @IsOptional()
  frontPresenceType?: FRONTPRESENCETYPE | null;
  @IsInt()
  @Min(1)
  @IsOptional()
  frontPresenceMonths?: number | null;
  @IsBoolean()
  @IsOptional()
  accepted?: boolean;
}
