import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { transformBooleanString } from 'src/common/transform-boolean';

export class CreateTransactionDto {
  @IsNumber()
  userId: number;

  @IsBoolean()
  @IsOptional()
  @Transform(transformBooleanString)
  isConfirmed?: boolean;

  @IsNumber()
  @IsOptional()
  presellingId?: number;

  @IsString()
  bank: string;

  @IsString()
  number: string;

  @IsString()
  @IsOptional()
  document?: string;

  @IsNumber()
  amount: number;

  @IsString()
  targetBank: string;

  @IsString()
  @IsOptional()
  detail?: string;

  @IsDate()
  @IsOptional()
  date?: Date;
}
