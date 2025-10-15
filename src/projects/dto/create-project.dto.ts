import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateProjectDto {
    @IsString()
    name: string;
    @IsNumber()
    landArea: number;
    @IsString()
    address: string;
    @IsDate()
    startDate: Date;
    @IsDate()
    endDate: Date;
}
