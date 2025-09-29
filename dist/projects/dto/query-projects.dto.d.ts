import { ProjectStatus } from "../schemas/project.schema";
export declare class QueryProjectsDto {
    page?: number;
    limit?: number;
    search?: string;
    status?: ProjectStatus;
}
