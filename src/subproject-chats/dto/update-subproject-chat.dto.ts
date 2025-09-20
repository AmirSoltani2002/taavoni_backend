import { PartialType } from '@nestjs/swagger';
import { CreateSubprojectChatDto } from './create-subproject-chat.dto';

export class UpdateSubprojectChatDto extends PartialType(CreateSubprojectChatDto) {}
