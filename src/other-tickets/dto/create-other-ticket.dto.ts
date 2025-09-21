import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateOtherTicketDto {
    @IsNumber()
    @IsOptional()
    userId?: number;
    @IsNumber()
    recieverId: number;
    @IsString()
    type: string;
}
