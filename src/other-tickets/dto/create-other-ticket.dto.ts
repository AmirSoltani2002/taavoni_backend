import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateOtherTicketDto {
    @IsNumber()
    @IsOptional()
    userId?: number;
    @IsNumber()
    @IsOptional()
    recieverId?: number;
    @IsString()
    type: string;
    @IsBoolean()
    @IsOptional()
    senderRead?: boolean;
    @IsBoolean()
    @IsOptional()
    recieverRead?: boolean;
    @IsBoolean()
    @IsOptional()
    closed?: boolean;
}
