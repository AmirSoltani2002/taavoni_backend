import { IsNumber, IsOptional, IsString } from "class-validator"

export class CreateSubprojectDto {
    @IsNumber()
    area: number
    @IsNumber()
    floor: number
    @IsNumber()
    point: number
    @IsNumber()
    block: number
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
