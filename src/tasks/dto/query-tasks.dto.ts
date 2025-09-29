import { IsOptional, IsEnum } from 'class-validator';
import { TaskStatus } from '../schemas/task.schema';

export class QueryTasksDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}




