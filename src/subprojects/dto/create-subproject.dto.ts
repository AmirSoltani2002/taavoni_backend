import { IsNumber, IsOptional } from "class-validator"

export class CreateSubprojectDto {
    @IsNumber()
    area: number
    @IsNumber()
    floor: number
    @IsNumber()
    point: number
    @IsNumber()
    @IsOptional()
    userId?: number
    @IsNumber()
    projectId: number
}
