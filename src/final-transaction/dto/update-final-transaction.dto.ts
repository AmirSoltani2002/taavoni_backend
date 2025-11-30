import { PartialType } from '@nestjs/swagger';
import { CreateFinalTransactionDto } from './create-final-transaction.dto';

export class UpdateFinalTransactionDto extends PartialType(CreateFinalTransactionDto) {}
