"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const project_schema_1 = require("./schemas/project.schema");
let ProjectsService = class ProjectsService {
    constructor(projectModel) {
        this.projectModel = projectModel;
    }
    async create(createProjectDto, userId) {
        const project = new this.projectModel({
            ...createProjectDto,
            owner: new mongoose_2.Types.ObjectId(userId),
        });
        return await project.save();
    }
    async findAll(userId, queryDto) {
        const page = queryDto.page || 1;
        const limit = queryDto.limit || 10;
        const { search, status } = queryDto;
        const skip = (page - 1) * limit;
        const filter = { owner: new mongoose_2.Types.ObjectId(userId) };
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
    async findOne(id, userId) {
        const project = await this.projectModel.findById(id).exec();
        if (!project) {
            throw new common_1.NotFoundException("Project not found");
        }
        const projectOwnerStr = project.owner.toString();
        const userIdStr = userId.toString();
        if (projectOwnerStr !== userIdStr) {
            throw new common_1.ForbiddenException("Access denied");
        }
        return project;
    }
    async update(id, updateProjectDto, userId) {
        const project = (await this.findOne(id, userId));
        Object.assign(project, updateProjectDto);
        project.updatedAt = new Date();
        return await project.save();
    }
    async remove(id, userId) {
        const project = await this.findOne(id, userId);
        await this.projectModel.findByIdAndDelete(id).exec();
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(project_schema_1.Project.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map