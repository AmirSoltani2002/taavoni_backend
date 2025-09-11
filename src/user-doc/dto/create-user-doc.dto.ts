import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUserDocDto {
    @IsNumber()
    userId: number
    @IsString()
    documet: string
    @IsString()
    @IsOptional()
    detail?: string;
}
