import { Module, Global } from '@nestjs/common';
import { PostgresBaseRepository } from './base.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from '../config';

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
  providers: [PostgresBaseRepository],
  exports: [PostgresBaseRepository],
})
export class DatabaseModule {}

