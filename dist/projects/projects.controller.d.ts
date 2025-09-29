import { ProjectsService } from "./projects.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { QueryProjectsDto } from "./dto/query-projects.dto";
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(createProjectDto: CreateProjectDto, req: any): Promise<import("./schemas/project.schema").Project>;
    findAll(queryDto: QueryProjectsDto, req: any): Promise<{
        projects: import("./schemas/project.schema").Project[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string, req: any): Promise<import("./schemas/project.schema").Project>;
    update(id: string, updateProjectDto: UpdateProjectDto, req: any): Promise<import("./schemas/project.schema").Project>;
    remove(id: string, req: any): Promise<void>;
}
