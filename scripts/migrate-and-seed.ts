import AppDataSource from '../src/shared/database/data-source';
import { Logger } from '@nestjs/common';

const logger = new Logger('MigrationScript');

async function runMigrationsAndSeed() {
  try {
    // Initialize the data source
    await AppDataSource.initialize();
    logger.log('Data source initialized');

    // Check current migration status
    const pendingMigrations = await AppDataSource.showMigrations();
    logger.log(`Pending migrations: ${pendingMigrations}`);

    // Run migrations if needed
    if (pendingMigrations) {
      logger.log('Running migrations...');
      await AppDataSource.runMigrations({ transaction: 'each' });
      logger.log('Migrations completed');
    } else {
      logger.log('No pending migrations');
    }

    // Check if seeding is needed
    const queryRunner = AppDataSource.createQueryRunner();
    const seedCheck = await queryRunner.query(
      `SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'tasks')`
    );

    if (seedCheck[0].exists) {
      const taskCount = await queryRunner.query('SELECT COUNT(*) FROM tasks');

      if (parseInt(taskCount[0].count) === 0) {
        logger.log('Seeding database...');
        await seedDatabase(queryRunner);
        logger.log('Seeding completed');
      } else {
        logger.log(
          `Database already has ${taskCount[0].count} tasks, skipping seeding`,
        );
      }
    }

    await queryRunner.release();
    logger.log('Migration and seeding process completed successfully');
    
  } catch (error) {
    logger.error('Error during migration and seeding:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

async function seedDatabase(queryRunner: any) {
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

// Run the script
runMigrationsAndSeed();