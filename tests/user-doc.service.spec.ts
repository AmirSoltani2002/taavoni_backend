import { DatabaseService } from '../src/database/database.service';
import { UserDocService } from '../src/user-doc/user-doc.service';

describe('UserDocService', () => {
  const userDoc = {
    create: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    update: jest.fn(),
  };
  const db = { userDoc };
  const service = new UserDocService(db as unknown as DatabaseService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('persists the validation state supplied by the trusted upload flow', async () => {
    userDoc.create.mockResolvedValue({ id: 12, validation: false });

    await service.create(
      { userId: 7, document: 'national-card.pdf', detail: 'کارت ملی' },
      false,
    );

    expect(userDoc.create).toHaveBeenCalledWith({
      data: {
        document: 'national-card.pdf',
        user: { connect: { id: 7 } },
        detail: 'کارت ملی',
        validation: false,
      },
    });
  });

  it('verifies an unverified document', async () => {
    userDoc.findUniqueOrThrow.mockResolvedValue({
      id: 12,
      validation: false,
    });
    userDoc.update.mockResolvedValue({ id: 12, validation: true });

    await expect(service.verify(12)).resolves.toEqual({
      id: 12,
      validation: true,
    });
    expect(userDoc.update).toHaveBeenCalledWith({
      where: { id: 12 },
      data: { validation: true },
    });
  });

  it('does not update an already verified document', async () => {
    const document = { id: 12, validation: true };
    userDoc.findUniqueOrThrow.mockResolvedValue(document);

    await expect(service.verify(12)).resolves.toBe(document);
    expect(userDoc.update).not.toHaveBeenCalled();
  });
});
