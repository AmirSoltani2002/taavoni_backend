import { PartialType } from '@nestjs/swagger';
import { CreatePreSellingDto } from './create-pre-selling.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdatePreSellingDto extends PartialType(CreatePreSellingDto) {
    @IsNumber()
    @IsOptional()
    totalPrice?: number;
}
