import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTransactionDto {
    @IsNumber()
    userId: number;

    @IsBoolean()
    @IsOptional()
    isConfirmed?: boolean;

    @IsNumber()
    projectId: number;

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
}
