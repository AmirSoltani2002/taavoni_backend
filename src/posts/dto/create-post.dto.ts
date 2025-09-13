import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePostDto {
    @IsNumber()
    subProjectId: number
    @IsString()
    @IsOptional()
    detail?: string
    @IsBoolean()
    available: boolean
}
