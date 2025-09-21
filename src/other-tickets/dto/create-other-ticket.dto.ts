import { IsNumber, IsString } from "class-validator";

export class CreateOtherTicketDto {
    @IsNumber()
    userId?: number;
    @IsNumber()
    recieverId: number;
    @IsString()
    type: string;
}
