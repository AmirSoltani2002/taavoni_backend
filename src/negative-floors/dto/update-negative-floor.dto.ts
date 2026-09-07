import { PartialType } from '@nestjs/swagger';
import { CreateNegativeFloorDto } from './create-negative-floor.dto';

export class UpdateNegativeFloorDto extends PartialType(
  CreateNegativeFloorDto,
) {}
