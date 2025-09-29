import { ProjectStatus } from '../schemas/project.schema';
export declare class CreateProjectDto {
    title: string;
    description: string;
    status?: ProjectStatus;
}
