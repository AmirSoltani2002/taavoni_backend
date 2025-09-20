import { PartialType } from '@nestjs/swagger';
import { CreateOtherTicketDto } from './create-other-ticket.dto';

export class UpdateOtherTicketDto extends PartialType(CreateOtherTicketDto) {}
