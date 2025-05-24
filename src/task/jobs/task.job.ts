import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TaskService } from '../services/task.service';
import { TaskStatus } from '../entities/task.entity';
import { DataSource } from 'typeorm';
import { TaskEventPublisher } from '../events';

@Injectable()
export class TaskSchedulerService {
  private readonly logger = new Logger(TaskSchedulerService.name);

  constructor(
    private readonly taskService: TaskService,
    private readonly dataSource: DataSource,
    private readonly taskEventPublisher: TaskEventPublisher
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'auto-complete-old-tasks',
    timeZone: 'UTC',
  })
  async handleAutoCompleteOldTasks(): Promise<void> {
    const startTime = new Date();
    this.logger.log('Scheduled job started: Auto-complete old tasks');

    try {
      const oldTasks = await this.taskService.getTasksOlderThan(7);

      if (!oldTasks.length) {
        this.logger.log('No tasks older than 7 days found.');
        return;
      }

      this.logger.log(`Found ${oldTasks.length} old tasks to complete`);

      await this.dataSource.transaction(async (manager) => {
        for (const task of oldTasks) {
          try {
            task.status = TaskStatus.COMPLETED;
            await manager.save(task);
            await this.taskEventPublisher.publishTaskEvent('updated', task);

            this.logger.log(`Task ID ${task.id} marked as completed`);
          } catch (error) {
            this.logger.error(
              `Failed to complete task ID ${task.id}`,
              error.stack,
            );
          }
        }
      });

    } catch (error) {
      this.logger.error('Job failed unexpectedly', error.stack);
    } finally {
      const duration = (new Date().getTime() - startTime.getTime()) / 1000;
      this.logger.log(`Job finished. Duration: ${duration}s`);
    }
  }
}