// import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

// export class CreateTaskTable1732400000000 implements MigrationInterface {
//   name = 'CreateTaskTable1732400000000';

//   public async up(queryRunner: QueryRunner): Promise<void> {
//     // Create enum type for task status
//     await queryRunner.query(`
//       DO $$ BEGIN
//         CREATE TYPE "task_status_enum" AS ENUM('pending', 'completed');
//       EXCEPTION
//         WHEN duplicate_object THEN null;
//       END $$;
//     `);

//     // Create tasks table
//     await queryRunner.createTable(
//       new Table({
//         name: 'tasks',
//         columns: [
//           {
//             name: 'id',
//             type: 'uuid',
//             isPrimary: true,
//             generationStrategy: 'uuid',
//             default: 'gen_random_uuid()',
//           },
//           {
//             name: 'title',
//             type: 'varchar',
//             length: '100',
//             isNullable: false,
//           },
//           {
//             name: 'description',
//             type: 'text',
//             isNullable: true,
//           },
//           {
//             name: 'status',
//             type: 'task_status_enum',
//             default: "'pending'",
//           },
//           {
//             name: 'createdAt',
//             type: 'timestamp',
//             default: 'CURRENT_TIMESTAMP',
//           },
//           {
//             name: 'updatedAt',
//             type: 'timestamp',
//             default: 'CURRENT_TIMESTAMP',
//             onUpdate: 'CURRENT_TIMESTAMP',
//           },
//         ],
//         // Add indexes directly to the table definition
//         indices: [
//           new TableIndex({
//             name: 'IDX_TASK_STATUS',
//             columnNames: ['status'],
//           }),
//           new TableIndex({
//             name: 'IDX_TASK_CREATED_AT',
//             columnNames: ['createdAt'],
//           }),
//           new TableIndex({
//             name: 'IDX_TASK_TITLE',
//             columnNames: ['title'],
//           }),
//         ],
//       }),
//       true,
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     // Drop tasks table (this will automatically drop the indexes)
//     await queryRunner.dropTable('tasks');

//     // Drop enum type
//     await queryRunner.query(`DROP TYPE IF EXISTS "task_status_enum"`);
//   }
// }