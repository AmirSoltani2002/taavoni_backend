import { DatabaseService } from '../src/database/database.service';
import { OtherTicketsService } from '../src/other-tickets/other-tickets.service';
import { SubProjectTicketsService } from '../src/sub-project-tickets/sub-project-tickets.service';

// Opt in only against a dedicated, disposable database with migrations applied.
const databaseUrl = process.env.IDENTIFIER_TEST_DATABASE_URL;
const databaseSuite = databaseUrl ? describe : describe.skip;

databaseSuite('User identifier PostgreSQL integration', () => {
  let db: DatabaseService;
  let ownerId: number;
  let adminId: number;
  let projectId: number;
  let ticketId: number;
  let unitTicketId: number;
  const prefix = `identifier-test-${process.pid}`;

  beforeAll(async () => {
    const url = new URL(databaseUrl!);
    if (
      url.hostname !== 'taavoni-identifier-postgres' ||
      url.pathname !== '/identifier_test'
    ) {
      throw new Error(
        'Identifier integration tests require their disposable PostgreSQL container',
      );
    }
    db = new DatabaseService({ datasources: { db: { url: databaseUrl } } });
    await db.$connect();
    const owner = await db.userinfo.create({
      data: {
        name: 'Owner',
        lastName: 'Test',
        sex: 'male',
        type: 'free',
        password: 'test-hash',
        nationalNumber: `${prefix}-owner`,
      },
    });
    const admin = await db.userinfo.create({
      data: {
        name: 'Admin',
        lastName: 'Test',
        sex: 'male',
        type: 'admin',
        password: 'test-hash',
        nationalNumber: `${prefix}-admin`,
      },
    });
    ownerId = owner.id;
    adminId = admin.id;
    const project = await db.project.create({
      data: { name: prefix, startDate: new Date() },
    });
    projectId = project.id;
    const block = await db.block.create({
      data: {
        name: prefix,
        floorCount: 1,
        shareArea: 0,
        buildingArea: 0,
        projectId,
      },
    });
    const unit = await db.subProject.create({
      data: {
        area: 10,
        floor: 1,
        roomCount: 1,
        direction: 'north',
        blockId: block.id,
      },
    });
    const ticket = await db.otherTicket.create({
      data: {
        type: 'signup',
        userId: ownerId,
        recieverId: adminId,
        chats: { create: { senderId: adminId, message: 'Reply' } },
      },
    });
    ticketId = ticket.id;
    const unitTicket = await db.subProjectTicket.create({
      data: {
        type: 'buy',
        userId: ownerId,
        subProjectId: unit.id,
        chats: { create: { senderId: adminId, message: 'Reply' } },
      },
    });
    unitTicketId = unitTicket.id;
  });

  beforeEach(async () => {
    await db.userinfo.updateMany({
      where: { id: { in: [ownerId, adminId] } },
      data: { identifier: null },
    });
  });

  afterAll(async () => {
    if (!db) return;
    if (projectId) await db.project.delete({ where: { id: projectId } });
    await db.userinfo.deleteMany({
      where: { nationalNumber: { startsWith: prefix } },
    });
    await db.$disconnect();
  });

  it('defaults identifiers to null and permits multiple unset users', async () => {
    const users = await db.userinfo.findMany({
      where: { id: { in: [ownerId, adminId] } },
    });
    expect(users).toHaveLength(2);
    expect(users.every((user) => user.identifier === null)).toBe(true);
  });

  it('enforces uniqueness including zero and permits reuse after clearing', async () => {
    await db.userinfo.update({
      where: { id: ownerId },
      data: { identifier: 0 },
    });
    await expect(
      db.userinfo.update({ where: { id: adminId }, data: { identifier: 0 } }),
    ).rejects.toMatchObject({ code: 'P2002' });
    await db.userinfo.update({
      where: { id: ownerId },
      data: { identifier: null },
    });
    await expect(
      db.userinfo.update({ where: { id: adminId }, data: { identifier: 0 } }),
    ).resolves.toMatchObject({ identifier: 0 });
    await expect(
      db.userinfo.findUnique({ where: { id: ownerId } }),
    ).resolves.toMatchObject({ id: ownerId, identifier: null });
  });

  it('rejects duplicate identifiers during creation', async () => {
    await db.userinfo.update({
      where: { id: ownerId },
      data: { identifier: 42 },
    });
    await expect(
      db.userinfo.create({
        data: {
          name: 'Duplicate',
          lastName: 'Test',
          sex: 'male',
          password: 'test-hash',
          nationalNumber: `${prefix}-duplicate`,
          identifier: 42,
        },
      }),
    ).rejects.toMatchObject({ code: 'P2002' });
  });

  it('enforces non-negative values even on direct database writes', async () => {
    await expect(
      db.userinfo.update({ where: { id: ownerId }, data: { identifier: -1 } }),
    ).rejects.toThrow();
    await expect(
      db.userinfo.findUnique({ where: { id: ownerId } }),
    ).resolves.toMatchObject({ identifier: null });
  });

  it('omits identifiers from ticket participants and chat senders', async () => {
    await db.userinfo.update({
      where: { id: adminId },
      data: { identifier: 42 },
    });
    const tickets = new OtherTicketsService(db);
    const list = await tickets.findAllUser(ownerId);
    expect(list[0].reciever).toMatchObject({ id: adminId });
    expect(list[0].reciever).not.toHaveProperty('identifier');
    const chat = await tickets.findOneChats(ticketId);
    expect(chat[0].chats[0].sender).toMatchObject({ id: adminId });
    expect(chat[0].chats[0].sender).not.toHaveProperty('identifier');
    const unitChat = await new SubProjectTicketsService(db).findOneChats(
      unitTicketId,
    );
    expect(unitChat[0].chats[0].sender).toMatchObject({ id: adminId });
    expect(unitChat[0].chats[0].sender).not.toHaveProperty('identifier');
  });
});
