import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateNegativeFloorDto {
  @IsInt()
  @Min(1)
  floorNumber: number;

  @IsInt()
  @Min(0)
  parkingCount: number;

  @IsInt()
  @Min(0)
  storageCount: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  blockId: number;
}
