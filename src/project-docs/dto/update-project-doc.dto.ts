import { PartialType } from '@nestjs/swagger';
import { CreateProjectDocDto } from './create-project-doc.dto';

export class UpdateProjectDocDto extends PartialType(CreateProjectDocDto) {}
