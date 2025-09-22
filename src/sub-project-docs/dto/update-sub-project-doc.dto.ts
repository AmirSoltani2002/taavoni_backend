import { PartialType } from '@nestjs/swagger';
import { CreateSubProjectDocDto } from './create-sub-project-doc.dto';

export class UpdateSubProjectDocDto extends PartialType(CreateSubProjectDocDto) {}
