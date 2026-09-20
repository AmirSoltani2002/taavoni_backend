import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { transformBooleanString } from 'src/common/transform-boolean';
import { CreateFinalTransactionDto } from './create-final-transaction.dto';

export class UpdateFinalTransactionDto extends PartialType(
  CreateFinalTransactionDto,
) {
  @IsBoolean()
  @IsOptional()
  @Transform(transformBooleanString)
  removeDocument?: boolean;
}
