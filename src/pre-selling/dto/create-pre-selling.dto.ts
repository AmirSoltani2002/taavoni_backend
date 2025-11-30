import { IsNumber } from "class-validator";

export class CreatePreSellingDto {
    @IsNumber()
    projectId: number;
    @IsNumber()
    userId: number;
    @IsNumber()
    area: number;
}
