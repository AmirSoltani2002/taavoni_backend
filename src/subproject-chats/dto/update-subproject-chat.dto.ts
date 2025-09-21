import { IsOptional, IsString } from "class-validator";

export class UpdateSubprojectChatDto {
    @IsString()
    @IsOptional()
    message?: string;
}
