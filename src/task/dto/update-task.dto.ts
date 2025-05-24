import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}

// export class UpdateTaskDto {
//   @IsOptional()
//   @IsString()
//   @IsNotEmpty()
//   @MaxLength(100, { message: 'Title must not exceed 100 characters' })
//   @Transform(({ value }) => value?.trim())
//   title?: string;

//   @IsOptional()
//   @IsString()
//   @Transform(({ value }) => value?.trim())
//   description?: string;

//   @IsOptional()
//   @IsEnum(TaskStatus, { message: 'Status must be either pending or completed' })
//   status?: TaskStatus;
// }