import { Injectable, NotFoundException } from '@nestjs/common';
import type { Task } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import type {
  CreateTaskDto,
  ListTasksQuery,
  UpdateTaskDto,
} from './tasks.schemas';

export interface PaginatedTasks {
  items: Task[];
  page: number;
  limit: number;
  total: number;
}

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string, query: ListTasksQuery): Promise<PaginatedTasks> {
    const { page, limit, status } = query;
    const where = { userId, ...(status ? { status } : {}) };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.task.count({ where }),
    ]);
    return { items, page, limit, total };
  }

  async findOne(userId: string, id: string): Promise<Task> {
    const task = await this.prisma.task.findFirst({ where: { id, userId } });
    if (!task) {
      throw new NotFoundException({
        code: 'TASK_NOT_FOUND',
        message: 'Task not found',
      });
    }
    return task;
  }

  create(userId: string, dto: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description ?? null,
        status: dto.status,
        dueDate: dto.dueDate ?? null,
        userId,
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateTaskDto): Promise<Task> {
    await this.findOne(userId, id);
    return this.prisma.task.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.dueDate !== undefined && { dueDate: dto.dueDate }),
      },
    });
  }

  async remove(userId: string, id: string): Promise<{ id: string }> {
    await this.findOne(userId, id);
    await this.prisma.task.delete({ where: { id } });
    return { id };
  }
}
