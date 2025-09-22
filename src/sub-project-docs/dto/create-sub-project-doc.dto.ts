import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSubProjectDocDto {
    @IsNumber()
    subProjectId: number
    @IsString()
    @IsOptional()
    document?: string
    @IsString()
    @IsOptional()
    detail?: string;
}
