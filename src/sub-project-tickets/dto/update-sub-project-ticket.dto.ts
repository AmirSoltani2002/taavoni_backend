import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSubProjectTicketDto {
    @IsNumber()
    @IsOptional()
    subProjectId?: number;
    @IsString()
    @IsOptional()
    type?: string;
}
