import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { CreateNegativeFloorDto } from './dto/create-negative-floor.dto';
import { UpdateNegativeFloorDto } from './dto/update-negative-floor.dto';
import { NegativeFloorsService } from './negative-floors.service';

@Roles(['admin', 'system'])
@Controller('negative-floors')
export class NegativeFloorsController {
  constructor(private readonly negativeFloorsService: NegativeFloorsService) {}

  @Post('multiple')
  createMany(
    @Body(new ParseArrayPipe({ items: CreateNegativeFloorDto }))
    createNegativeFloorDtos: CreateNegativeFloorDto[],
  ) {
    return this.negativeFloorsService.createMany(createNegativeFloorDtos);
  }

  @Post()
  create(@Body() createNegativeFloorDto: CreateNegativeFloorDto) {
    return this.negativeFloorsService.create(createNegativeFloorDto);
  }

  @Get()
  findAll() {
    return this.negativeFloorsService.findAll();
  }

  @Get('block/:blockId')
  findAllByBlock(@Param('blockId') blockId: string) {
    return this.negativeFloorsService.findAllByBlock(+blockId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.negativeFloorsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNegativeFloorDto: UpdateNegativeFloorDto,
  ) {
    return this.negativeFloorsService.update(+id, updateNegativeFloorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.negativeFloorsService.remove(+id);
  }
}
