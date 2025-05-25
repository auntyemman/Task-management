import { Injectable, Logger } from '@nestjs/common';
import { TaskSeeder } from './seeders/task.seeder';
// import { UserSeeder } from './seeders/user.seeder';
// Import other seeders as needed

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly taskSeeder: TaskSeeder,
    // private readonly userSeeder: UserSeeder,
    // Inject other seeders
  ) {}

  async seedAll(): Promise<void> {
    this.logger.log('Starting database seeding process...');

    try {
      // Run seeders in order of dependency
      // Users first (if tasks depend on users)
      // await this.userSeeder.seed();
      
      // Then tasks
      await this.taskSeeder.seed();
      
      // Add other seeders here
      
      this.logger.log('All seeding completed successfully');
    } catch (error) {
      this.logger.error('Error during seeding process:', error);
      throw error;
    }
  }

  async clearAll(): Promise<void> {
    this.logger.log('Starting database clearing process...');

    try {
      // Clear in reverse order of dependencies
      await this.taskSeeder.clear();
      // await this.userSeeder.clear();
      
      this.logger.log('All data cleared successfully');
    } catch (error) {
      this.logger.error('Error during clearing process:', error);
      throw error;
    }
  }

  async seedSpecific(seederName: string): Promise<void> {
    this.logger.log(`Running specific seeder: ${seederName}`);

    switch (seederName.toLowerCase()) {
      case 'task':
      case 'tasks':
        await this.taskSeeder.seed();
        break;
    //   case 'user':
    //   case 'users':
    //     await this.userSeeder.seed();
    //     break;
      default:
        throw new Error(`Unknown seeder: ${seederName}`);
    }
  }

  async clearSpecific(seederName: string): Promise<void> {
    this.logger.log(`Clearing specific data: ${seederName}`);

    switch (seederName.toLowerCase()) {
      case 'task':
      case 'tasks':
        await this.taskSeeder.clear();
        break;
    //   case 'user':
    //   case 'users':
    //     await this.userSeeder.clear();
    //     break;
      default:
        throw new Error(`Unknown seeder: ${seederName}`);
    }
  }
}



// import { Injectable, Logger } from '@nestjs/common';
// import { DataSource } from 'typeorm';
// import { InjectDataSource } from '@nestjs/typeorm';

// export interface SeedData {
//   title: string;
//   description: string;
//   status: 'pending' | 'completed';
// }

// @Injectable()
// export class SeedService {
//   private readonly logger = new Logger(SeedService.name);

//   constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

//   async seedTasks(): Promise<void> {
//     const queryRunner = this.dataSource.createQueryRunner();
    
//     try {
//       // Check if tasks table exists and has data
//       const tableExists = await this.checkTableExists('tasks');
//       if (!tableExists) {
//         this.logger.warn('Tasks table does not exist. Run migrations first.');
//         return;
//       }

//       const existingTasksCount = await this.getTasksCount();
//       if (existingTasksCount > 0) {
//         this.logger.log(`Tasks table already has ${existingTasksCount} records. Skipping seeding.`);
//         return;
//       }

//       this.logger.log('Starting database seeding...');
//       await this.insertSeedData();
//       this.logger.log('Database seeding completed successfully');

//     } catch (error) {
//       this.logger.error('Error during seeding:', error);
//       throw error;
//     } finally {
//       await queryRunner.release();
//     }
//   }

//   private async checkTableExists(tableName: string): Promise<boolean> {
//     try {
//       const result = await this.dataSource.query(
//         `SELECT EXISTS (
//           SELECT FROM information_schema.tables 
//           WHERE table_schema = 'public' 
//           AND table_name = $1
//         )`,
//         [tableName]
//       );
//       return result[0].exists;
//     } catch (error) {
//       this.logger.error(`Error checking if table ${tableName} exists:`, error);
//       return false;
//     }
//   }

//   private async getTasksCount(): Promise<number> {
//     try {
//       const result = await this.dataSource.query('SELECT COUNT(*) as count FROM tasks');
//       return parseInt(result[0].count, 10);
//     } catch (error) {
//       this.logger.error('Error getting tasks count:', error);
//       return 0;
//     }
//   }

//   private async insertSeedData(): Promise<void> {
//     const seedTasks: SeedData[] = [
//       {
//         title: 'Complete project documentation',
//         description: 'Write comprehensive documentation for the task management API',
//         status: 'pending',
//       },
//       {
//         title: 'Set up CI/CD pipeline',
//         description: 'Configure GitHub Actions for automated testing and deployment',
//         status: 'pending',
//       },
//       {
//         title: 'Implement user authentication',
//         description: 'Add JWT authentication and authorization middleware',
//         status: 'completed',
//       },
//       {
//         title: 'Design database schema',
//         description: 'Create ERD and implement database migrations',
//         status: 'completed',
//       },
//       {
//         title: 'Write unit tests',
//         description: 'Achieve 80% code coverage with comprehensive unit tests',
//         status: 'pending',
//       },
//       {
//         title: 'Optimize API performance',
//         description: 'Implement caching and optimize database queries',
//         status: 'pending',
//       },
//       {
//         title: 'Setup monitoring and logging',
//         description: 'Integrate application monitoring and structured logging',
//         status: 'pending',
//       },
//       {
//         title: 'Create API documentation',
//         description: 'Generate Swagger documentation for all endpoints',
//         status: 'completed',
//       },
//       {
//         title: 'Implement real-time notifications',
//         description: 'Add WebSocket support for real-time task updates',
//         status: 'pending',
//       },
//       {
//         title: 'Setup error handling',
//         description: 'Implement global error handling and validation',
//         status: 'completed',
//       },
//       {
//         title: 'Code review and refactoring',
//         description: 'Review code quality and refactor for better maintainability',
//         status: 'pending',
//       },
//       {
//         title: 'Deploy to production',
//         description: 'Deploy the application to cloud hosting service',
//         status: 'pending',
//       },
//     ];

//     // Use transaction for all inserts
//     await this.dataSource.transaction(async (manager) => {
//       for (const task of seedTasks) {
//         await manager.query(
//           `INSERT INTO tasks (title, description, status, "createdAt", "updatedAt") 
//            VALUES ($1, $2, $3::task_status_enum, NOW(), NOW())`,
//           [task.title, task.description, task.status]
//         );
//       }
//     });

//     this.logger.log(`Successfully seeded ${seedTasks.length} tasks`);
//   }

//   async clearTasks(): Promise<void> {
//     try {
//       this.logger.log('Clearing tasks table...');
//       await this.dataSource.query('DELETE FROM tasks');
//       this.logger.log('Tasks table cleared successfully');
//     } catch (error) {
//       this.logger.error('Error clearing tasks:', error);
//       throw error;
//     }
//   }
// }