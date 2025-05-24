import { MigrationInterface, QueryRunner, Table, Index } from 'typeorm';

export class CreateTaskTable1732400000000 implements MigrationInterface {
  name = 'CreateTaskTable1732400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum type for task status
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "task_status_enum" AS ENUM('pending', 'completed');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create tasks table
    await queryRunner.createTable(
      new Table({
        name: 'tasks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'task_status_enum',
            default: "'pending'",
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create indexes for better query performance
    await queryRunner.createIndex(
      'tasks',
      new Index('IDX_TASK_STATUS', ['status']),
    );

    await queryRunner.createIndex(
      'tasks',
      new Index('IDX_TASK_CREATED_AT', ['createdAt']),
    );

    await queryRunner.createIndex(
      'tasks',
      new Index('IDX_TASK_TITLE', ['title']),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex('tasks', 'IDX_TASK_TITLE');
    await queryRunner.dropIndex('tasks', 'IDX_TASK_CREATED_AT');
    await queryRunner.dropIndex('tasks', 'IDX_TASK_STATUS');

    // Drop tasks table
    await queryRunner.dropTable('tasks');

    // Drop enum type
    await queryRunner.query(`DROP TYPE IF EXISTS "task_status_enum"`);
  }
}