import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { PrismaService } from '../../prisma/prisma.service';

describe('TasksService — ownership guard', () => {
  const OWNER_ID = 'user-owner';
  const OTHER_ID = 'user-other';
  const TASK_ID = 'task-1';

  function buildService(prismaMock: Partial<PrismaService>) {
    return new TasksService(prismaMock as PrismaService);
  }

  it('findOne returns the task when userId matches', async () => {
    const fakeTask = {
      id: TASK_ID,
      title: 't',
      description: null,
      status: 'pending',
      dueDate: null,
      userId: OWNER_ID,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const prisma = {
      task: {
        findFirst: jest.fn().mockResolvedValue(fakeTask),
      },
    } as unknown as PrismaService;

    const service = buildService(prisma);
    await expect(service.findOne(OWNER_ID, TASK_ID)).resolves.toEqual(fakeTask);
    expect(prisma.task.findFirst).toHaveBeenCalledWith({
      where: { id: TASK_ID, userId: OWNER_ID },
    });
  });

  it('findOne throws NotFoundException when the task belongs to another user', async () => {
    const prisma = {
      task: {
        findFirst: jest.fn().mockResolvedValue(null),
      },
    } as unknown as PrismaService;

    const service = buildService(prisma);
    await expect(service.findOne(OTHER_ID, TASK_ID)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(prisma.task.findFirst).toHaveBeenCalledWith({
      where: { id: TASK_ID, userId: OTHER_ID },
    });
  });
});
