import { subProjectTicketType } from "@prisma/client";
import { IsBoolean, IsEnum, IsNumber, IsOptional } from "class-validator";

export class CreateSubProjectTicketDto {
    @IsNumber()
    userId?: number;
    @IsNumber()
    subProjectId: number;
    @IsEnum(subProjectTicketType)
    type: subProjectTicketType;
    @IsBoolean()
    @IsOptional()
    senderRead?: boolean;
    @IsBoolean()
    @IsOptional()
    adminRead?: boolean;
    @IsBoolean()
    @IsOptional()
    closed?: boolean;
}

