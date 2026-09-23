import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { transformBooleanString } from 'src/common/transform-boolean';
import {
  transformNullableDate,
  transformNullableString,
} from 'src/common/transform-nullable';

export class CreateFinalTransactionDto {
  @IsNumber()
  userId: number;

  @IsBoolean()
  @IsOptional()
  @Transform(transformBooleanString)
  isConfirmed?: boolean;

  @IsNumber()
  subProjectId: number;

  @IsString()
  @IsOptional()
  @Transform(transformNullableString)
  bank?: string | null;

  @IsString()
  @IsOptional()
  @Transform(transformNullableString)
  number?: string | null;

  @IsString()
  @IsOptional()
  document?: string;

  @IsDate()
  @IsOptional()
  @Transform(transformNullableDate)
  date?: Date | null;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  @Transform(transformNullableString)
  targetBank?: string | null;

  @IsString()
  @IsOptional()
  detail?: string;
}
