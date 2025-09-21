import { subProjectTicketType } from "@prisma/client";
import { IsEnum, IsNumber } from "class-validator";

export class CreateSubProjectTicketDto {
    @IsNumber()
    userId?: number;
    @IsNumber()
    subProjectId: number;
    @IsEnum(subProjectTicketType)
    type: subProjectTicketType;
}

