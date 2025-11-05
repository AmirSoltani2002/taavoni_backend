import { Injectable } from '@nestjs/common';
import { CreateUserDocDto } from './dto/create-user-doc.dto';
import { UpdateUserDocDto } from './dto/update-user-doc.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserDocService {
  constructor(private readonly db: DatabaseService){}

  create(createUserDocDto: CreateUserDocDto) {
    const {userId, document, detail} = createUserDocDto;
    return this.db.userDoc.create({
      data: {
        document: document as string,
        user: {connect: {id: userId} },
        detail
      }
    })
  }

  findAll(detail?: string) {
    return this.db.userDoc.findMany({
      include: {user: true},
      where: {detail}
    });
  }

  findAllByUser(id: number, detail?: string) {
    return this.db.userDoc.findMany({
      include: {user: true},
      where: {userId: id, detail: detail}
    });
  }


  findOne(id: number) {
    return this.db.userDoc.findUniqueOrThrow({
      where: {id},
      include: {user: true}
    })
  }

  update(id: number, updateUserDocDto: UpdateUserDocDto) {
    const {userId, ...rest} = updateUserDocDto;
    return this.db.userDoc.update({
      where: {id},
      data: {
        ...rest,
        user: userId ? {connect: {id: userId}} : undefined
      },
    })
  }

  updateByUser(id: number, updateUserDocDto: UpdateUserDocDto, detail: string) {
    const {userId, ...rest} = updateUserDocDto;
    return this.db.userDoc.updateMany({
      where: {userId: id, detail: detail},
      data: {
        ...rest,
      },
    })
  }

  remove(id: number) {
    return this.db.userDoc.delete({
      where: {id}
    })
  }

  removeByUser(id: number, detail: string) {
    return this.db.userDoc.deleteMany({
      where: {userId: id, detail: detail}
    })
  }
}
