import { Injectable } from '@nestjs/common';
import { PaginationResult, PostgresBaseRepository } from '../../shared';
import { Task, TaskStatus } from '../entities';
import { LessThan, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskQueryDto } from '../dto';


@Injectable()
export class TaskRepository extends PostgresBaseRepository<Task>{
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {
    super(taskRepo);
  }

  async findByStatus(status: TaskStatus): Promise<Task[]> {
    return await this.taskRepo.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }

  async searchByTitle(title: string): Promise<Task[]> {
    return await this.taskRepo.find({
      where: { title: Like(`%${title}%`) },
      order: { createdAt: 'DESC' },
    });
  }

  async findTasksOlderThan(days: number): Promise<Task[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return await this.taskRepo.find({
      where: {
        createdAt: LessThan(cutoffDate),
        status: TaskStatus.PENDING,
      },
      order: { createdAt: 'ASC' },
    });
  }

  async updateTasksStatus(
    taskIds: string[],
    status: TaskStatus,
  ): Promise<void> {
    await this.taskRepo
      .createQueryBuilder()
      .update(Task)
      .set({ status, updatedAt: new Date() })
      .whereInIds(taskIds)
      .execute();
  }

  async findWithFilters(
    options: TaskQueryDto,
  ): Promise<PaginationResult<Task>> {
    const { status, search, page = 1, limit = 10 } = options;

    const queryBuilder = this.taskRepo.createQueryBuilder('task');

    // Apply status filter
    if (status) {
      queryBuilder.andWhere('task.status = :status', { status });
    }

    // Apply search filter
    if (search) {
      queryBuilder.andWhere('LOWER(task.title) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

    // Add ordering
    queryBuilder.orderBy('task.createdAt', 'DESC');

    // Get total count for pagination
    const total = await queryBuilder.getCount();

    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    // Execute query
    const tasks = await queryBuilder.getMany();

    // Pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data: tasks,
      currentPage: page,
      totalPages,
      totalCount: total,
      pageSize: limit,
      hasNextPage,
      hasPreviousPage,
    };
  }

  async getTaskStatistics(): Promise<{
    total: number;
    pending: number;
    completed: number;
  }> {
    const [total, pending, completed] = await Promise.all([
      this.taskRepo.count(),
      this.taskRepo.count({ where: { status: TaskStatus.PENDING } }),
      this.taskRepo.count({ where: { status: TaskStatus.COMPLETED } }),
    ]);

    return { total, pending, completed };
  }

}