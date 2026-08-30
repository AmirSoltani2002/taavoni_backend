import { SEX, TYPE } from '@prisma/client';
import { validate } from 'class-validator';
import { CreateUserDto } from '../src/users/dto/create-user.dto';

function createUserDto(type: unknown): CreateUserDto {
  return Object.assign(new CreateUserDto(), {
    name: 'Test',
    lastName: 'User',
    sex: SEX.male,
    nationalNumber: '0012345678',
    password: 'safe-password',
    type,
  });
}

describe('User membership types', () => {
  it.each([TYPE.universityFaculty, TYPE.otherUniversityFaculty])(
    'accepts %s when creating a user',
    async (type) => {
      await expect(validate(createUserDto(type))).resolves.toEqual([]);
    },
  );

  it('rejects an unknown membership type', async () => {
    const errors = await validate(createUserDto('other'));

    expect(errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ property: 'type' })]),
    );
  });
});
