import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSubprojectChatDto {
    @IsNumber()
    ticketId: number;
    @IsNumber()
    @IsOptional()
    senderId?: number;
    @IsString()
    message: string;
}
