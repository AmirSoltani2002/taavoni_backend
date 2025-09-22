import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUserDocDto {
    @IsNumber()
    userId: number
    @IsString()
    document: string
    @IsString()
    @IsOptional()
    detail?: string;
}
