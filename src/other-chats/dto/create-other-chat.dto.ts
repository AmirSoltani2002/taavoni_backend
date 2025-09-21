import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateOtherChatDto {
    @IsNumber()
    ticketId: number;
    @IsNumber()
    @IsOptional()
    senderId?: number;
    @IsString()
    message: string;
}
