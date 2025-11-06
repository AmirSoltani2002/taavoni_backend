import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTransactionDto {
    @IsNumber()
    userId: number;

    @IsNumber()
    subProjectId: number;

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
    @IsOptional()
    detail?: string;
}
