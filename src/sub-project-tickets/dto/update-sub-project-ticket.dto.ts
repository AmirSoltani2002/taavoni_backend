import { PartialType } from '@nestjs/swagger';
import { CreateSubProjectTicketDto } from './create-sub-project-ticket.dto';

export class UpdateSubProjectTicketDto extends PartialType(CreateSubProjectTicketDto) {}
