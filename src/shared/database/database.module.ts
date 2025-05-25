import { Module, Global } from '@nestjs/common';
import { PostgresBaseRepository } from './base.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from '../config';
import { MigrationService } from './migration.service';
import { SeedService } from './seeding/seed.service';
import { TaskSeeder } from './seeding/seeders/task.seeder';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => 
        DatabaseConfig.getConfig(configService),
    })
  ],
  providers: [
    PostgresBaseRepository,
    MigrationService, 
    
    // All seeders
    TaskSeeder,
    //UserSeeder,
    
    // Master seed service
    SeedService,
  ],
  exports: [
    PostgresBaseRepository,
    MigrationService,
    SeedService, 
    
    // Export individual seeders if needed
    TaskSeeder,
    // UserSeeder,
  ],
})
export class DatabaseModule {}

