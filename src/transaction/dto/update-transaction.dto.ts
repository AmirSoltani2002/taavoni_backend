import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { transformBooleanString } from 'src/common/transform-boolean';
import { CreateTransactionDto } from './create-transaction.dto';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @IsBoolean()
  @IsOptional()
  @Transform(transformBooleanString)
  removeDocument?: boolean;
}
