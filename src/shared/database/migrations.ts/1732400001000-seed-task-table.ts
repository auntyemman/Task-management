import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTasks1732400001000 implements MigrationInterface {
  name = 'SeedTasks1732400001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM tasks WHERE title IN (
      'Complete project documentation',
      'Set up CI/CD pipeline',
      'Implement user authentication',
      'Design database schema',
      'Write unit tests',
      'Optimize API performance',
      'Setup monitoring and logging',
      'Create API documentation',
      'Implement real-time notifications',
      'Setup error handling',
      'Code review and refactoring',
      'Deploy to production'
    )`);
  }
}