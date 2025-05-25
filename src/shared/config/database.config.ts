import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Task } from '../../task/entities/task.entity';

export class DatabaseConfig {
  static getConfig(configService: ConfigService): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: configService.get<string>('DB_HOST', 'localhost'),
      port: configService.get<number>('DB_PORT', 5432),
      username: configService.get<string>('DB_USERNAME', 'postgres'),
      password: configService.get<string>('DB_PASSWORD', 'password'),
      database: configService.get<string>('DB_NAME', 'task_management'),
      entities: [Task],
      migrations: ['dist/shared/database/migrations/*.js'],
      migrationsRun: configService.get<boolean>('DB_MIGRATIONS_RUN', false),
      synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
      logging: configService.get<boolean>('DB_LOGGING', false),
    };
  }
}