import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Task } from '../../task/entities/task.entity';

export class DatabaseConfig {
  static getConfig(configService: ConfigService): TypeOrmModuleOptions {
    const isProduction = configService.get<string>('NODE_ENV') === 'production';
    return {
      type: 'postgres',
      host: configService.get<string>('DB_HOST', 'localhost'),
      port: configService.get<number>('DB_PORT', 5432),
      username: configService.get<string>('DB_USERNAME', 'menaget'),
      password: configService.get<string>('DB_PASSWORD', 'menaget'),
      database: configService.get<string>('DB_NAME', 'menaget'),
      entities: [Task],
      migrations: [
        isProduction
          ? 'dist/shared/database/migrations/*.js'
          : 'src/shared/database/migrations/*.ts',
      ],
      migrationsTableName: 'migrations',
      migrationsRun: configService.get<boolean>('DB_MIGRATIONS_RUN', false),
      synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
      logging: configService.get<boolean>('DB_LOGGING', false),
      migrationsTransactionMode: 'each', // Run each migration in its own transaction
    };
  }
}