import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBlockDto {
    @IsString()
    name: string;
    @IsNumber()
    floorCount: number;
    @IsNumber()
    shareArea: number;
    @IsNumber()
    buildingArea: number;
    @IsString()
    @IsOptional()
    description?: string;
    @IsNumber()
    projectId: number;
}
