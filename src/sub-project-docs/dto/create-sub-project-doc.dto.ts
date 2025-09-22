export class CreateSubProjectDocDto {
    @IsNumber()
    subProjectId: number
    @IsString()
    documet: string
    @IsString()
    @IsOptional()
    detail?: string;
}
