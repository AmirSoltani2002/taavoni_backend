import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDocDto } from './dto/create-user-doc.dto';
import { UpdateUserDocDto } from './dto/update-user-doc.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserDocService {
  constructor(private readonly db: DatabaseService){}

  create(createUserDocDto: CreateUserDocDto, validation: boolean) {
    const {userId, document, detail} = createUserDocDto;
    return this.db.userDoc.create({
      data: {
        document: document as string,
        user: {connect: {id: userId} },
        detail,
        validation
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

  async update(
    id: number,
    updateUserDocDto: UpdateUserDocDto,
    consumeInvestorEdit = false,
  ) {
    const { userId, ...rest } = updateUserDocDto;
    if (consumeInvestorEdit) {
      const result = await this.db.userDoc.updateMany({
        where: {
          id,
          validation: false,
          editedByInvestor: false,
        },
        data: {
          ...rest,
          validation: false,
          editedByInvestor: true,
        },
      });
      if (result.count !== 1) {
        throw new ConflictException(
          'ویرایش این مدرک تنها یک بار و قبل از تایید شدن آن امکان‌پذیر است.',
        );
      }
      return this.findOne(id);
    }
    return this.db.userDoc.update({
      where: { id },
      data: {
        ...rest,
        user: userId ? { connect: { id: userId } } : undefined,
      },
    });
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

  async verify(id: number) {
    const document = await this.db.userDoc.findUniqueOrThrow({
      where: {id},
    });
    if (document.validation) {
      return document;
    }
    return this.db.userDoc.update({
      where: {id},
      data: {validation: true},
    });
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
