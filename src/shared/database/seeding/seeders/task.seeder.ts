import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseSeeder } from '../abstracts/base.seeder';
import { Task, TaskStatus } from '../../../../task/entities/task.entity';

interface TaskSeedData {
  title: string;
  description: string;
  status: TaskStatus;
}

@Injectable()
export class TaskSeeder extends BaseSeeder {
  private readonly taskRepository: Repository<Task>;

  constructor(@InjectDataSource() dataSource: DataSource) {
    super(dataSource);
    this.taskRepository = this.dataSource.getRepository(Task);
  }

  async shouldSeed(): Promise<boolean> {
    const tableExists = await this.checkTableExists('tasks');
    if (!tableExists) {
      this.logger.warn('Tasks table does not exist. Run migrations first.');
      return false;
    }

    const existingCount = await this.taskRepository.count();
    if (existingCount > 0) {
      this.logger.log(
        `Tasks table already has ${existingCount} records. Skipping seeding.`,
      );
      return false;
    }

    return true;
  }

  async seed(): Promise<void> {
    if (!(await this.shouldSeed())) {
      return;
    }

    this.logger.log('Starting task seeding...');

    const seedData: TaskSeedData[] = [
      {
        title: 'Complete project documentation',
        description:
          'Write comprehensive documentation for the task management API',
        status: TaskStatus.PENDING,
      },
      {
        title: 'Set up CI/CD pipeline',
        description:
          'Configure GitHub Actions for automated testing and deployment',
        status: TaskStatus.PENDING,
      },
      {
        title: 'Implement user authentication',
        description: 'Add JWT authentication and authorization middleware',
        status: TaskStatus.COMPLETED,
      },
      {
        title: 'Design database schema',
        description: 'Create ERD and implement database migrations',
        status: TaskStatus.COMPLETED,
      },
      {
        title: 'Write unit tests',
        description: 'Achieve 80% code coverage with comprehensive unit tests',
        status: TaskStatus.PENDING,
      },
      {
        title: 'Optimize API performance',
        description: 'Implement caching and optimize database queries',
        status: TaskStatus.PENDING,
      },
      {
        title: 'Setup monitoring and logging',
        description: 'Integrate application monitoring and structured logging',
        status: TaskStatus.PENDING,
      },
      {
        title: 'Create API documentation',
        description: 'Generate Swagger documentation for all endpoints',
        status: TaskStatus.COMPLETED,
      },
      {
        title: 'Implement real-time notifications',
        description: 'Add WebSocket support for real-time task updates',
        status: TaskStatus.PENDING,
      },
      {
        title: 'Deploy to production',
        description: 'Deploy the application to cloud hosting service',
        status: TaskStatus.PENDING,
      },
    ];

    await this.dataSource.transaction(async (manager) => {
      const taskRepo = manager.getRepository(Task);

      for (const data of seedData) {
        const task = taskRepo.create(data);
        await taskRepo.save(task);
      }
    });

    this.logger.log(`Successfully seeded ${seedData.length} tasks`);
  }

  async clear(): Promise<void> {
    try {
      this.logger.log('Clearing tasks table...');
      await this.taskRepository.delete({});
      this.logger.log('Tasks table cleared successfully');
    } catch (error) {
      this.logger.error('Error clearing tasks:', error);
      throw error;
    }
  }
}