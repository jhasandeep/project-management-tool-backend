import { Model } from "mongoose";
import { Task, TaskDocument } from "./schemas/task.schema";
import { ProjectDocument } from "../projects/schemas/project.schema";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { QueryTasksDto } from "./dto/query-tasks.dto";
export declare class TasksService {
    private taskModel;
    private projectModel;
    constructor(taskModel: Model<TaskDocument>, projectModel: Model<ProjectDocument>);
    create(projectId: string, createTaskDto: CreateTaskDto, userId: string): Promise<Task>;
    findAll(projectId: string, queryDto: QueryTasksDto, userId: string): Promise<Task[]>;
    findOne(id: string, userId: string): Promise<Task>;
    update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task>;
    remove(id: string, userId: string): Promise<void>;
}
