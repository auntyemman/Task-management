import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { SeedService } from '../src/shared/database/seeding/seed.service';
import { Logger } from '@nestjs/common';

async function clearDatabase() {
  const logger = new Logger('ClearScript');
  
  try {
    logger.log('Starting database clearing...');
    
    const app = await NestFactory.createApplicationContext(AppModule);
    const seedService = app.get(SeedService);

    // Get command line arguments
    const args = process.argv.slice(2);
    const target = args[0]; // specific table/entity name

    if (target) {
      logger.log(`Clearing specific entity: ${target}`);
      await seedService.clearSpecific(target);
    } else {
      logger.log('Clearing all entities...');
      await seedService.clearAll();
    }

    logger.log('Database clearing completed successfully');
    await app.close();
    process.exit(0);
    
  } catch (error) {
    logger.error('Database clearing failed:', error);
    process.exit(1);
  }
}

clearDatabase();