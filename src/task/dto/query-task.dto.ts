import { 
  IsString, 
  IsOptional, 
  IsEnum,
  IsUUID,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { TaskStatus } from '../entities/task.entity';

export class TaskQueryDto {
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Status must be either pending or completed' })
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'Page must be greater than 0' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'Limit must be greater than 0' })
  @Max(100, { message: 'Limit must not exceed 100' })
  limit?: number = 10;
}

export class TaskParamDto {
  @IsUUID(4, { message: 'Invalid task ID format' })
  id: string;
}
