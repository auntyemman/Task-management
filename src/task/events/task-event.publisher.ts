import { Injectable, Logger } from '@nestjs/common';
import { AblyService } from '../../shared/ably/ably.service';
import { Task } from '../entities';

@Injectable()
export class TaskEventPublisher {
  private readonly logger = new Logger(TaskEventPublisher.name);
  private readonly channel = 'task';

  constructor(private readonly ably: AblyService) {}

  async publishTaskEvent(
    action: 'created' | 'updated' | 'deleted',
    task: Task,
  ) {
    try {
      const payload = {
        id: task.id,
        title: task.title,
        status: task.status,
        action,
      };
      await this.ably.publish(this.channel, 'task-event', payload);
      this.logger.log(`Task event (${action}) published for task ${task.id}`);
    } catch (error) {
      this.logger.error(`Failed to publish task event`, error.stack);
    }
  }
}
