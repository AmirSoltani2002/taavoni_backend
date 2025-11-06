import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateInvoiceDto {
    @IsNumber()
    userId: number;

    @IsNumber()
    subProjectId: number;

    @IsNumber()
    @IsOptional()
    amount?: number;

    @IsString()
    @IsOptional()
    number?: string;

    @IsString()
    @IsOptional()
    document?: string;

    @IsString()
    @IsOptional()
    detail?: string;
}
