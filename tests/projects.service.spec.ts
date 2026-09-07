import { DatabaseService } from '../src/database/database.service';
import { ProjectsService } from '../src/projects/projects.service';

describe('ProjectsService', () => {
  const db = {
    project: { findUniqueOrThrow: jest.fn() },
  };
  const service = new ProjectsService(db as unknown as DatabaseService);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('loads negative floors with blocks when editing a project', async () => {
    db.project.findUniqueOrThrow.mockResolvedValue({ id: 5, blocks: [] });

    await service.findOne(5);

    expect(db.project.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: 5 },
      include: {
        blocks: {
          include: {
            subProjects: true,
            negativeFloors: true,
          },
        },
      },
    });
  });
});
