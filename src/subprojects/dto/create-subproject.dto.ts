import { IsNumber, IsOptional, IsString } from "class-validator"

export class CreateSubprojectDto {
    @IsNumber()
    area: number
    @IsNumber()
    floor: number
    @IsNumber()
    @IsOptional()
    point?: number
    @IsNumber()
    @IsOptional()
    unitNumber?: number
    @IsNumber()
    roomCount: number
    @IsString()
    @IsOptional()
    options?: string
    @IsNumber()
    @IsOptional()
    userId?: number
    @IsNumber()
    blockId: number
    @IsString()
    direction: string
    @IsNumber()
    @IsOptional()
    pricePerMeter?: number;
}
