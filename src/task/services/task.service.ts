import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { TaskRepository } from '../respositories/task.repository';
import { Task, TaskStatus } from '../entities/task.entity';
import { CreateTaskDto, UpdateTaskDto, TaskQueryDto } from '../dto';
import { PaginationResult } from 'src/shared';
import { TaskEventPublisher } from '../events';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly taskEventPublisher: TaskEventPublisher,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      this.logger.log(`Creating new task: ${createTaskDto.title}`);

      const createdTask = await this.taskRepository.create(createTaskDto);

      this.logger.log(`Task created successfully with ID: ${createdTask.id}`);

      // Publish task creation event
      await this.taskEventPublisher.publishTaskEvent('created', createdTask);
      return createdTask;
    } catch (error) {
      this.logger.error(`Failed to create task: ${error.message}`, error.stack);
      throw new UnprocessableEntityException('Failed to create task');
    }
  }

  async getAllTasks(queryDto: TaskQueryDto): Promise<PaginationResult<Task>> {
    try {
      this.logger.log(
        `Fetching tasks with filters: ${JSON.stringify(queryDto)}`,
      )

      const result = await this.taskRepository.findWithFilters(queryDto);

      this.logger.log(`Found ${result.totalCount} tasks matching criteria`);

      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch tasks: ${error.message}`, error.stack);
      throw new UnprocessableEntityException('Failed to fetch tasks');
    }
  }

  async getTaskById(id: string): Promise<Task> {
    try {
      this.logger.log(`Fetching task with ID: ${id}`);

      const task = await this.taskRepository.findById(id);

      if (!task) {
        this.logger.warn(`Task not found with ID: ${id}`);
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      this.logger.log(`Task found: ${task.title}`);

      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch task: ${error.message}`, error.stack);
      throw new UnprocessableEntityException('Failed to fetch task');
    }
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    try {
      this.logger.log(`Updating task with ID: ${id}`);

      // Check if task exists
      const existingTask = await this.taskRepository.findById(id);
      if (!existingTask) {
        this.logger.warn(`Task not found for update with ID: ${id}`);
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      // Update task
      const updatedTask = await this.taskRepository.updateById(
        id,
        updateTaskDto,
      )
      this.logger.log(`Task updated successfully: ${updatedTask.title}`);

      // Publish task update event
      await this.taskEventPublisher.publishTaskEvent('updated', updatedTask);
      return updatedTask;
    } catch (error) {
      this.logger.error(`Failed to update task: ${error.message}`, error.stack);
      throw new UnprocessableEntityException('Failed to update task');
    }
  }

  async deleteTask(id: string): Promise<{ data: boolean }> {
    try {
      this.logger.log(`Deleting task with ID: ${id}`);

      // Check if task exists
      const existingTask = await this.taskRepository.findById(id);
      if (!existingTask) {
        this.logger.warn(`Task not found for deletion with ID: ${id}`);
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      await this.taskRepository.deleteById(id);

      this.logger.log(`Task deleted successfully with ID: ${id}`);

      // Publish task deletion event
      await this.taskEventPublisher.publishTaskEvent('created', existingTask);
      return {
        data: true
      };
    } catch (error) {
      this.logger.error(`Failed to delete task: ${error.message}`, error.stack);
      throw new UnprocessableEntityException('Failed to delete task');
    }
  }

  async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    try {
      this.logger.log(`Fetching tasks with status: ${status}`);

      const tasks = await this.taskRepository.findByStatus(status);

      this.logger.log(`Found ${tasks.length} tasks with status: ${status}`);

      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to fetch tasks by status: ${error.message}`,
        error.stack,
      );
      throw new UnprocessableEntityException('Failed to fetch tasks by status');
    }
  }

  async searchTasks(searchTerm: string): Promise<Task[]> {
    try {
      this.logger.log(`Searching tasks with term: ${searchTerm}`);

      const tasks = await this.taskRepository.searchByTitle(searchTerm);

      this.logger.log(`Found ${tasks.length} tasks matching search term`);

      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to search tasks: ${error.message}`,
        error.stack,
      );
      throw new UnprocessableEntityException('Failed to search tasks');
    }
  }

  async getTasksOlderThan(days: number): Promise<Task[]> {
    try {
      this.logger.log(`Fetching tasks older than ${days} days`);

      const tasks = await this.taskRepository.findTasksOlderThan(days);

      this.logger.log(`Found ${tasks.length} tasks older than ${days} days`);

      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to fetch old tasks: ${error.message}`,
        error.stack,
      );
      throw new UnprocessableEntityException('Failed to fetch old tasks');
    }
  }

  async markTasksAsCompleted(taskIds: string[]): Promise<void> {
    try {
      this.logger.log(`Marking ${taskIds.length} tasks as completed`);

      await this.taskRepository.updateTasksStatus(
        taskIds,
        TaskStatus.COMPLETED,
      )
      this.logger.log(
        `Successfully marked ${taskIds.length} tasks as completed`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to mark tasks as completed: ${error.message}`,
        error.stack,
      );
      throw new UnprocessableEntityException(
        'Failed to mark tasks as completed',
      );
    }
  }

  async getTaskStatistics(): Promise<{
    total: number;
    pending: number;
    completed: number;
    completionRate: number;
  }> {
    try {
      this.logger.log('Fetching task statistics');

      const stats = await this.taskRepository.getTaskStatistics();
      const completionRate =
        stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

      const result = {
        ...stats,
        completionRate: Math.round(completionRate * 100) / 100, // Round to 2 decimal places
      };

      this.logger.log(`Task statistics: ${JSON.stringify(result)}`);

      return {
        total: result.total,
        pending: result.pending,
        completed: result.completed,
        completionRate: result.completionRate,
      }
    } catch (error) {
      this.logger.error(
        `Failed to fetch task statistics: ${error.message}`,
        error.stack,
      );
      throw new UnprocessableEntityException('Failed to fetch task statistics');
    }
  }

}