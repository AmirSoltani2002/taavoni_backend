export class CreateProjectDocDto {
    @IsNumber()
    projectId: number
    @IsString()
    documet: string
    @IsString()
    @IsOptional()
    detail?: string;
}
