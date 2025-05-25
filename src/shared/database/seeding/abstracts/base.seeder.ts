import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ISeeder } from '../interfaces/seeder.interface';

@Injectable()
export abstract class BaseSeeder implements ISeeder {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(protected readonly dataSource: DataSource) {}

  abstract seed(): Promise<void>;
  abstract clear(): Promise<void>;
  abstract shouldSeed(): Promise<boolean>;

  protected async checkTableExists(tableName: string): Promise<boolean> {
    try {
      const result = await this.dataSource.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )`,
        [tableName]
      );
      return result[0].exists;
    } catch (error) {
      this.logger.error(`Error checking if table ${tableName} exists:`, error);
      return false;
    }
  }

  protected async getRecordCount(tableName: string): Promise<number> {
    try {
      const result = await this.dataSource.query(
        `SELECT COUNT(*) as count FROM ${tableName}`,
      );
      return parseInt(result[0].count, 10);
    } catch (error) {
      this.logger.error(`Error getting ${tableName} count:`, error);
      return 0;
    }
  }
}