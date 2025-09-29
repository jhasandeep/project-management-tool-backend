import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(projectId: string, createTaskDto: CreateTaskDto, req: any): Promise<import("./schemas/task.schema").Task>;
    findAll(projectId: string, queryDto: QueryTasksDto, req: any): Promise<import("./schemas/task.schema").Task[]>;
}
export declare class TasksControllerSingle {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    findOne(id: string, req: any): Promise<import("./schemas/task.schema").Task>;
    update(id: string, updateTaskDto: UpdateTaskDto, req: any): Promise<import("./schemas/task.schema").Task>;
    remove(id: string, req: any): Promise<void>;
}
