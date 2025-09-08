import { IsNumber } from "class-validator"

export class CreateSubprojectDto {
    @IsNumber()
    area: number
    @IsNumber()
    floor: number
    @IsNumber()
    point: number
    @IsNumber()
    userId?: number
    @IsNumber()
    projectId: number
}
