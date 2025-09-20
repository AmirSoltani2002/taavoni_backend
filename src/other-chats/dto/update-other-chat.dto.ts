import { PartialType } from '@nestjs/swagger';
import { CreateOtherChatDto } from './create-other-chat.dto';

export class UpdateOtherChatDto extends PartialType(CreateOtherChatDto) {}
