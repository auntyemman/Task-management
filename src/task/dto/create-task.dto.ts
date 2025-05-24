import { 
  IsString, 
  IsOptional, 
  IsEnum, 
  MaxLength, 
  IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { TaskStatus } from '../entities/task.entity';

// Request DTOs
export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'Title must not exceed 100 characters' })
  @Transform(({ value }) => value?.trim())
  title: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Status must be either pending or completed' })
  status?: TaskStatus;
}

// Response DTOs
export class TaskResponseDto {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

// export class TaskListResponseDto {
//   tasks: TaskResponseDto[];
//   pagination: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//   };
// }

export class TaskCreatedResponseDto {
  task: TaskResponseDto;
}
