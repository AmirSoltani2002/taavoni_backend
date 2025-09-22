import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProjectDocDto {
    @IsNumber()
    projectId: number
    @IsString()
    document: string
    @IsString()
    @IsOptional()
    detail?: string;
}
