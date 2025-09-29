import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Task, TaskDocument } from "./schemas/task.schema";
import { Project, ProjectDocument } from "../projects/schemas/project.schema";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { QueryTasksDto } from "./dto/query-tasks.dto";

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>
  ) {}

  async create(
    projectId: string,
    createTaskDto: CreateTaskDto,
    userId: string
  ): Promise<Task> {
    // Verify project ownership
    const project = await this.projectModel.findById(projectId).exec();
    if (!project) {
      throw new NotFoundException("Project not found");
    }
    if (project.owner.toString() !== userId) {
      throw new ForbiddenException("Access denied");
    }

    const taskData = {
      ...createTaskDto,
      project: projectId,
    };

    // Convert dueDate string to Date if provided
    if (taskData.dueDate && typeof taskData.dueDate === "string") {
      taskData.dueDate = new Date(taskData.dueDate);
    }

    const task = new this.taskModel(taskData);
    return task.save();
  }

  async findAll(
    projectId: string,
    queryDto: QueryTasksDto,
    userId: string
  ): Promise<Task[]> {
    // Verify project ownership
    const project = await this.projectModel.findById(projectId).exec();
    if (!project) {
      throw new NotFoundException("Project not found");
    }
    if (project.owner.toString() !== userId) {
      throw new ForbiddenException("Access denied");
    }

    const filter: any = { project: projectId };

    if (queryDto.status) {
      filter.status = queryDto.status;
    }

    return this.taskModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.taskModel.findById(id).populate("project").exec();

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    const project = task.project as any;
    if (project.owner.toString() !== userId) {
      throw new ForbiddenException("Access denied");
    }

    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string
  ): Promise<Task> {
    const task = (await this.findOne(id, userId)) as TaskDocument;

    // Convert dueDate string to Date if provided
    const updateData = { ...updateTaskDto };
    if (updateData.dueDate && typeof updateData.dueDate === "string") {
      updateData.dueDate = new Date(updateData.dueDate);
    }

    Object.assign(task, updateData);
    task.updatedAt = new Date();

    return await task.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.findOne(id, userId);
    await this.taskModel.findByIdAndDelete(id).exec();
  }
}
