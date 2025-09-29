import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Document, Types } from "mongoose";
import { Project, ProjectDocument } from "./schemas/project.schema";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { QueryProjectsDto } from "./dto/query-projects.dto";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    userId: string
  ): Promise<Project> {
    const project = new this.projectModel({
      ...createProjectDto,
      owner: new Types.ObjectId(userId),
    });
    return await project.save();
  }

  async findAll(
    userId: string,
    queryDto: QueryProjectsDto
  ): Promise<{
    projects: Project[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const { search, status } = queryDto;
    const skip = (page - 1) * limit;

    const filter: any = { owner: new Types.ObjectId(userId) };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    const [projects, total] = await Promise.all([
      this.projectModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.projectModel.countDocuments(filter).exec(),
    ]);

    return {
      projects,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string): Promise<Project> {
    const project = await this.projectModel.findById(id).exec();

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    // Convert both to strings for comparison
    const projectOwnerStr = project.owner.toString();
    const userIdStr = userId.toString();

    if (projectOwnerStr !== userIdStr) {
      throw new ForbiddenException("Access denied");
    }

    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    userId: string
  ): Promise<Project> {
    const project = (await this.findOne(id, userId)) as ProjectDocument;

    Object.assign(project, updateProjectDto);
    project.updatedAt = new Date();

    return await project.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    const project = await this.findOne(id, userId);
    await this.projectModel.findByIdAndDelete(id).exec();
  }
}
