import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
    @IsString()
    name: string;
    @IsNumber()
    @IsOptional()
    landArea?: number;
    @IsString()
    @IsOptional()
    address?: string;
    @IsDate()
    startDate: Date;
    @IsDate()
    @IsOptional()
    endDate?: Date;
    @IsNumber()
    @IsOptional()
    longitude?: number;
    @IsNumber()
    @IsOptional()
    latitude?: number;
    @IsNumber()
    @IsOptional()
    pricePerMeter?: number;
}
