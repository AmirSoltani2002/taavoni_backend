import { Reflector } from '@nestjs/core';
import { TYPE } from '@prisma/client';

export const Roles = Reflector.createDecorator<TYPE[]>();
export const Public = Reflector.createDecorator<boolean>();