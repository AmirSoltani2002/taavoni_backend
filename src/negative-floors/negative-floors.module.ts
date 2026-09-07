import { Module } from '@nestjs/common';
import { NegativeFloorsController } from './negative-floors.controller';
import { NegativeFloorsService } from './negative-floors.service';

@Module({
  controllers: [NegativeFloorsController],
  providers: [NegativeFloorsService],
})
export class NegativeFloorsModule {}
