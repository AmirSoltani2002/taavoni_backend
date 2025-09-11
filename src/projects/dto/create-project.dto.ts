import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
    @IsString()
    name: string;
    @IsString()
    address: string;
    @IsNumber()
    sharedArea: number;
    @IsNumber()
    floorCount: number;
    @IsNumber()
    unitCount: number;
    @IsNumber()
    landArea: number;
    @IsNumber()
    buildingArea: number;
    @IsNumber()
    blockNumber: number;
    @IsOptional()
    @IsString()
    options?: string;
    @IsDate()
    startDate: Date;
    @IsDate()
    endDate: Date;
}
