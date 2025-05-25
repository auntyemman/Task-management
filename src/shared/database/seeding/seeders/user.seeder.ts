// import { Injectable } from '@nestjs/common';
// import { DataSource, Repository } from 'typeorm';
// import { InjectDataSource } from '@nestjs/typeorm';
// import { BaseSeeder } from '../abstracts/base.seeder';
// import { User } from '../../../user/entities/user.entity'; // Adjust path as needed

// interface UserSeedData {
//   email: string;
//   firstName: string;
//   lastName: string;
//   // Add other user fields as needed
// }

// @Injectable()
// export class UserSeeder extends BaseSeeder {
//   private readonly userRepository: Repository<User>;

//   constructor(@InjectDataSource() dataSource: DataSource) {
//     super(dataSource);
//     this.userRepository = this.dataSource.getRepository(User);
//   }

//   async shouldSeed(): Promise<boolean> {
//     const tableExists = await this.checkTableExists('users');
//     if (!tableExists) {
//       this.logger.warn('Users table does not exist. Run migrations first.');
//       return false;
//     }

//     // const existingCount = await this.userRepository.count();
//     const existingCount = await this.getRecordCount('users');
//     if (existingCount > 0) {
//       this.logger.log(`Users table already has ${existingCount} records. Skipping seeding.`);
//       return false;
//     }

//     return true;
//   }

//   async seed(): Promise<void> {
//     if (!(await this.shouldSeed())) {
//       return;
//     }

//     this.logger.log('Starting user seeding...');

//     const seedData: UserSeedData[] = [
//       {
//         email: 'john.doe@example.com',
//         firstName: 'John',
//         lastName: 'Doe',
//       },
//       {
//         email: 'jane.smith@example.com',
//         firstName: 'Jane',
//         lastName: 'Smith',
//       },
//       {
//         email: 'admin@example.com',
//         firstName: 'Admin',
//         lastName: 'User',
//       },
//       {
//         email: 'test.user@example.com',
//         firstName: 'Test',
//         lastName: 'User',
//       },
//     ];

//     await this.dataSource.transaction(async (manager) => {
//       // const userRepo = manager.getRepository(User);
      
//       for (const data of seedData) {
//         // Using raw SQL as example since User entity might not exist yet
//         await manager.query(
//           `INSERT INTO users (email, "firstName", "lastName", "createdAt", "updatedAt") 
//            VALUES ($1, $2, $3, NOW(), NOW())`,
//           [data.email, data.firstName, data.lastName]
//         );
        
//         // Or with repository:
//         // const user = userRepo.create(data);
//         // await userRepo.save(user);
//       }
//     });

//     this.logger.log(`Successfully seeded ${seedData.length} users`);
//   }

//   async clear(): Promise<void> {
//     try {
//       this.logger.log('Clearing users table...');
//       // await this.userRepository.delete({});
//       await this.dataSource.query('DELETE FROM users');
//       this.logger.log('Users table cleared successfully');
//     } catch (error) {
//       this.logger.error('Error clearing users:', error);
//       throw error;
//     }
//   }
// }