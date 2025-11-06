import { IsNumber } from "class-validator";

export class CreateTransactionHistoryDto {
    @IsNumber()
    subProjectId: number;
    @IsNumber()
    userId: number;
}
