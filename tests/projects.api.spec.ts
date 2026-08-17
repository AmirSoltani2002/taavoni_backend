import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { ProjectsController } from '../src/projects/projects.controller';
import { ProjectsService } from '../src/projects/projects.service';

describe('Projects API', () => {
  let app: INestApplication;
  let httpServer: Parameters<typeof request>[0];
  const projectsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllName: jest.fn(),
    findAvailable: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [{ provide: ProjectsService, useValue: projectsService }],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer() as Parameters<typeof request>[0];
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /projects creates a project with the request body', async () => {
    const body = { name: 'Project A', startDate: '2026-08-17' };
    const created = { id: 1, ...body };
    projectsService.create.mockResolvedValue(created);

    await request(httpServer)
      .post('/projects')
      .send(body)
      .expect(201)
      .expect(created);

    expect(projectsService.create).toHaveBeenCalledWith(body);
  });

  it('GET /projects/all returns all projects', async () => {
    const projects = [{ id: 1, name: 'Project A' }];
    projectsService.findAll.mockResolvedValue(projects);

    await request(httpServer).get('/projects/all').expect(200).expect(projects);
  });

  it('GET /projects/all/name returns project names', async () => {
    const projects = [{ id: 1, name: 'Project A' }];
    projectsService.findAllName.mockResolvedValue(projects);

    await request(httpServer)
      .get('/projects/all/name')
      .expect(200)
      .expect(projects);
  });

  it('GET /projects/available returns available projects', async () => {
    const projects = [{ id: 2, name: 'Available Project' }];
    projectsService.findAvailable.mockResolvedValue(projects);

    await request(httpServer)
      .get('/projects/available')
      .expect(200)
      .expect(projects);
  });

  it('GET /projects/:id converts the id and returns one project', async () => {
    const project = { id: 7, name: 'Project Seven' };
    projectsService.findOne.mockResolvedValue(project);

    await request(httpServer).get('/projects/7').expect(200).expect(project);

    expect(projectsService.findOne).toHaveBeenCalledWith(7);
  });

  it('PATCH /projects/:id updates the requested project', async () => {
    const body = { name: 'Updated Project' };
    const project = { id: 7, ...body };
    projectsService.update.mockResolvedValue(project);

    await request(httpServer)
      .patch('/projects/7')
      .send(body)
      .expect(200)
      .expect(project);

    expect(projectsService.update).toHaveBeenCalledWith(7, body);
  });

  it('DELETE /projects/:id removes the requested project', async () => {
    const project = { id: 7, name: 'Deleted Project' };
    projectsService.remove.mockResolvedValue(project);

    await request(httpServer).delete('/projects/7').expect(200).expect(project);

    expect(projectsService.remove).toHaveBeenCalledWith(7);
  });
});
