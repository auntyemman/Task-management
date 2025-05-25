// src/shared/database/data-source.ts
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Task } from '../../task/entities/task.entity';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 6432),
  username: configService.get<string>('DB_USERNAME', 'menaget'),
  password: configService.get<string>('DB_PASSWORD', 'menaget'),
  database: configService.get<string>('DB_NAME', 'menaget'),
  entities: [Task],
  migrations: ['src/shared/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: configService.get<boolean>('DB_LOGGING', false),
});

export default AppDataSource;