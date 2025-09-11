import { PartialType } from '@nestjs/swagger';
import { CreateUserDocDto } from './create-user-doc.dto';

export class UpdateUserDocDto extends PartialType(CreateUserDocDto) {}
