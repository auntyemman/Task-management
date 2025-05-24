import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { TaskService } from '../services';
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskQueryDto,
  TaskParamDto,
  TaskResponseDto,
} from '../dto';
import { Task, TaskStatus } from '../entities';
import { ApiResponse } from '../../shared';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<ApiResponse<Task>> {
    const result = await this.taskService.createTask(createTaskDto);
    return new ApiResponse<Task>('Task created successfully', result);
  }

  @Get()
  async getAllTasks(
    @Query() queryDto: TaskQueryDto,
    @Req() request: Request,
  ): Promise<PaginatedResponse<TaskResponseDto[]>> {
    const result = await this.taskService.getAllTasks(queryDto);
    return {
      ...result,
      path: request.url,
    };
  }

  @Get(':id')
  async getTaskById(
    @Param() paramDto: TaskParamDto,
  ): Promise<ApiResponse<Task>> {
    const result = await this.taskService.getTaskById(paramDto.id);
    return new ApiResponse<Task>('Task retrieved successfully', result);
  }

  @Patch(':id')
  async updateTask(
    @Param() paramDto: TaskParamDto,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<ApiResponse<Task>> {
    const result = await this.taskService.updateTask(
      paramDto.id,
      updateTaskDto,
    );
    return new ApiResponse<Task>('Task updated successfully', result);
  }

  @Delete(':id')
  async deleteTask(
    @Param() paramDto: TaskParamDto,
  ): Promise<ApiResponse<{ data: boolean }>> {
    const result = await this.taskService.deleteTask(paramDto.id);
    return new ApiResponse<{ data: boolean }>(
      'Task deleted successfully',
      result,
    );
  }

  @Get('status/:status')
  async getTasksByStatus(
    @Param('status') status: TaskStatus,
  ): Promise<ApiResponse<Task>> {
    const result = await this.taskService.getTasksByStatus(status);
    return new ApiResponse<Task>('Task retrieved successfully', result);
  }

  @Get('search/:term')
  async searchTasks(
    @Param('term') searchTerm: string,
  ): Promise<ApiResponse<Task>> {
    const result = await this.taskService.searchTasks(searchTerm);
    return new ApiResponse<Task>('Task retrieved successfully', result);
  }

  @Get('stats/overview')
  async getTaskStatistics(): Promise<
    ApiResponse<{
      total: number;
      pending: number;
      completed: number;
      completionRate: number;
    }>
  > {
    const result = await this.taskService.getTaskStatistics();
    return new ApiResponse<{
      total: number;
      pending: number;
      completed: number;
      completionRate: number;
    }>('Task retrieved successfully', result);
  }

}