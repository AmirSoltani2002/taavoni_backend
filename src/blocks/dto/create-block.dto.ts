import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateBlockDto {
  @IsString()
  name: string;

  @IsNumber()
  floorCount: number;

  @IsInt()
  @Min(0)
  negativeFloorCount: number;

  @IsNumber()
  shareArea: number;

  @IsNumber()
  buildingArea: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  projectId: number;
}
