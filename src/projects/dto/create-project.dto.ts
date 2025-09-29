import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { ProjectStatus } from '../schemas/project.schema';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus = ProjectStatus.ACTIVE;
}
