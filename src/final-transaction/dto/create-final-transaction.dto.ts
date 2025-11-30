import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateFinalTransactionDto {
    @IsNumber()
    userId: number;

    @IsBoolean()
    @IsOptional()
    isConfirmed?: boolean;

    @IsNumber()
    @IsOptional()
    subProjectId?: number;

    @IsString()
    bank: string;

    @IsString()
    number: string;

    @IsString()
    @IsOptional()
    document?: string;

    @IsDate()
    @IsOptional()
    date?: Date;

    @IsNumber()
    amount: number;

    @IsString()
    targetBank: string;

    @IsString()
    @IsOptional()
    detail?: string;
}
