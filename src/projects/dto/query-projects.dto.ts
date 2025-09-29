import { IsOptional, IsString, IsEnum } from "class-validator";
import { Transform } from "class-transformer";
import { ProjectStatus } from "../schemas/project.schema";

export class QueryProjectsDto {
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 1))
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 10))
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}
