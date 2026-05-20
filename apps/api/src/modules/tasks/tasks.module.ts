import { Module } from '@nestjs/common';
import { AuthModule } from '@/modules/auth/auth.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [AuthModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
