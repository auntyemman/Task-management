import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { SeedService } from '../src/shared/database/seeding/seed.service';
import { Logger } from '@nestjs/common';

async function runSeeding() {
  const logger = new Logger('SeedScript');
  
  try {
    logger.log('Starting database seeding...');
    
    const app = await NestFactory.createApplicationContext(AppModule);
    const seedService = app.get(SeedService);

    // Get command line arguments
    const args = process.argv.slice(2);
    const target = args[0]; // specific table/entity name

    if (target) {
      logger.log(`Seeding specific entity: ${target}`);
      await seedService.seedSpecific(target);
    } else {
      logger.log('Seeding all entities...');
      await seedService.seedAll();
    }

    logger.log('Database seeding completed successfully');
    await app.close();
    process.exit(0);
    
  } catch (error) {
    logger.error('Database seeding failed:', error);
    process.exit(1);
  }
}

runSeeding();


// import 'reflect-metadata';
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from '../src/app.module';
// import { SeedService } from '../src/shared/database/seeding/seed.service';
// import { Logger } from '@nestjs/common';

// async function runSeeding() {
//   const logger = new Logger('SeedScript');
  
//   try {
//     logger.log('Starting seeding process...');
    
//     // Create NestJS application context
//     const app = await NestFactory.createApplicationContext(AppModule);
    
//     // Get the seed service
//     const seedService = app.get(SeedService);
    
//     // Run seeding
//     await seedService.seedTasks();
    
//     logger.log('Seeding completed successfully');
//     await app.close();
//     process.exit(0);
    
//   } catch (error) {
//     logger.error('Seeding failed:', error);
//     process.exit(1);
//   }
// }

// runSeeding();