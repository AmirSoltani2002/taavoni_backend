import { IsNumber, IsOptional, IsString } from "class-validator"

export class CreateSubprojectDto {
    @IsNumber()
    area: number
    @IsNumber()
    floor: number
    @IsNumber()
    @IsOptional()
    point?: number
    @IsString()
    block: string
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
    projectId: number
}
