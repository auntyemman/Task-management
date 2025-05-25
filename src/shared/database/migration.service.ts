import { Injectable, Logger } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async runMigrationsAndSeed(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // Run pending migrations
      await this.runMigrations();
      
      // Run seeding (only if not already seeded)
      await this.seedDatabase();
      
      this.logger.log('Migrations and seeding completed successfully');
    } catch (error) {
      this.logger.error('Error during migration and seeding:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async runMigrations(): Promise<void> {
    try {
      const pendingMigrations = await this.dataSource.showMigrations();
      
      if (pendingMigrations) {
        this.logger.log('Running pending migrations...');
        await this.dataSource.runMigrations({ transaction: 'each' });
        this.logger.log('Migrations completed');
      } else {
        this.logger.log('No pending migrations');
      }
    } catch (error) {
      this.logger.error('Error running migrations:', error);
      throw error;
    }
  }

  private async seedDatabase(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    
    try {
      // Check if seeding has already been done
      const seedCheck = await queryRunner.query(
        `SELECT EXISTS(SELECT 1 FROM tasks WHERE title = 'Complete project documentation')`
      );

      if (!seedCheck[0].exists) {
        this.logger.log('Seeding database...');
        await this.insertSeedData(queryRunner);
        this.logger.log('Database seeding completed');
      } else {
        this.logger.log('Database already seeded, skipping...');
      }
    } catch (error) {
      this.logger.error('Error seeding database:', error);
      throw error;
    }
  }

  private async insertSeedData(queryRunner: QueryRunner): Promise<void> {
    const seedTasks = [
      {
        title: 'Complete project documentation',
        description:
          'Write comprehensive documentation for the task management API',
        status: 'pending',
      },
      {
        title: 'Set up CI/CD pipeline',
        description:
          'Configure GitHub Actions for automated testing and deployment',
        status: 'pending',
      },
      {
        title: 'Implement user authentication',
        description: 'Add JWT authentication and authorization middleware',
        status: 'completed',
      },
      {
        title: 'Design database schema',
        description: 'Create ERD and implement database migrations',
        status: 'completed',
      },
      {
        title: 'Write unit tests',
        description: 'Achieve 80% code coverage with comprehensive unit tests',
        status: 'pending',
      },
      {
        title: 'Optimize API performance',
        description: 'Implement caching and optimize database queries',
        status: 'pending',
      },
      {
        title: 'Setup monitoring and logging',
        description: 'Integrate application monitoring and structured logging',
        status: 'pending',
      },
      {
        title: 'Create API documentation',
        description: 'Generate Swagger documentation for all endpoints',
        status: 'completed',
      },
      {
        title: 'Implement real-time notifications',
        description: 'Add WebSocket support for real-time task updates',
        status: 'pending',
      },
      {
        title: 'Setup error handling',
        description: 'Implement global error handling and validation',
        status: 'completed',
      },
      {
        title: 'Code review and refactoring',
        description:
          'Review code quality and refactor for better maintainability',
        status: 'pending',
      },
      {
        title: 'Deploy to production',
        description: 'Deploy the application to cloud hosting service',
        status: 'pending',
      },
    ];

    for (const task of seedTasks) {
      await queryRunner.query(
        `INSERT INTO tasks (title, description, status, "createdAt", "updatedAt") 
         VALUES ($1, $2, $3::task_status_enum, NOW(), NOW())`,
        [task.title, task.description, task.status],
      );
    }
  }

  async checkMigrationStatus(): Promise<any> {
    try {
      const pendingMigrations = await this.dataSource.showMigrations();
      const executedMigrations = await this.dataSource.query(
        'SELECT * FROM migrations ORDER BY timestamp DESC'
      );
      
      return {
        hasPendingMigrations: pendingMigrations,
        executedMigrations,
      };
    } catch (error) {
      this.logger.error('Error checking migration status:', error);
      throw error;
    }
  }
}
