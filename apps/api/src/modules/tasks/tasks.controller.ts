import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateTaskSchema,
  ListTasksQuerySchema,
  UpdateTaskSchema,
  type CreateTaskDto,
  type ListTasksQuery,
  type UpdateTaskDto,
} from './tasks.schemas';
import { TasksService, type PaginatedTasks } from './tasks.service';
import type { Task } from '@prisma/client';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'List tasks (paginated, filterable by status)' })
  list(
    @CurrentUser() user: AuthUser,
    @Query(new ZodValidationPipe(ListTasksQuerySchema)) query: ListTasksQuery,
  ): Promise<PaginatedTasks> {
    return this.tasks.list(user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single task by id' })
  get(@CurrentUser() user: AuthUser, @Param('id') id: string): Promise<Task> {
    return this.tasks.findOne(user.id, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  create(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(CreateTaskSchema)) dto: CreateTaskDto,
  ): Promise<Task> {
    return this.tasks.create(user.id, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task (partial)' })
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateTaskSchema)) dto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasks.update(user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a task' })
  remove(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ): Promise<{ id: string }> {
    return this.tasks.remove(user.id, id);
  }
}
