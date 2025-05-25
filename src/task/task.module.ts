import { Module } from '@nestjs/common';
import { TaskService } from './services';
import { TaskController } from './controllers/task.controller';
import { TaskRepository } from './respositories';
import { TaskEventPublisher } from './events';
import { TaskSchedulerService } from './jobs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { AblyModule } from '../shared/ably/ably.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), AblyModule],
  controllers: [TaskController],
  providers: [
    TaskEventPublisher,
    TaskService,
    TaskSchedulerService,
    TaskRepository,
  ],
  exports: [TaskService, TaskEventPublisher], 
})
export class TaskModule {}
