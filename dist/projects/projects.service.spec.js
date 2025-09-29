"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const mongoose_1 = require("@nestjs/mongoose");
const common_1 = require("@nestjs/common");
const projects_service_1 = require("./projects.service");
const project_schema_1 = require("./schemas/project.schema");
describe("ProjectsService", () => {
    let service;
    let model;
    const mockProject = {
        _id: "1",
        title: "Test Project",
        description: "Test Description",
        status: "active",
        owner: "507f1f77bcf86cd799439011",
        save: jest.fn(),
    };
    const mockModel = {
        find: jest.fn(),
        findById: jest.fn(),
        findByIdAndDelete: jest.fn(),
        countDocuments: jest.fn(),
    };
    const MockModel = jest.fn().mockImplementation(() => mockProject);
    Object.assign(MockModel, mockModel);
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                projects_service_1.ProjectsService,
                {
                    provide: (0, mongoose_1.getModelToken)(project_schema_1.Project.name),
                    useValue: MockModel,
                },
            ],
        }).compile();
        service = module.get(projects_service_1.ProjectsService);
        model = module.get((0, mongoose_1.getModelToken)(project_schema_1.Project.name));
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
    describe("create", () => {
        it("should create a project successfully", async () => {
            const createProjectDto = {
                title: "Test Project",
                description: "Test Description",
                status: "active",
            };
            mockProject.save.mockResolvedValue(mockProject);
            const result = await service.create(createProjectDto, "507f1f77bcf86cd799439011");
            expect(result).toEqual(mockProject);
            expect(mockProject.save).toHaveBeenCalled();
        });
    });
    describe("findOne", () => {
        it("should return project if found and user owns it", async () => {
            model.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockProject),
            });
            const result = await service.findOne("1", "507f1f77bcf86cd799439011");
            expect(result).toEqual(mockProject);
            expect(model.findById).toHaveBeenCalledWith("1");
        });
        it("should throw NotFoundException if project not found", async () => {
            model.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });
            await expect(service.findOne("1", "507f1f77bcf86cd799439011")).rejects.toThrow(common_1.NotFoundException);
        });
        it("should throw ForbiddenException if user does not own project", async () => {
            model.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue({ ...mockProject, owner: "user2" }),
            });
            await expect(service.findOne("1", "507f1f77bcf86cd799439011")).rejects.toThrow(common_1.ForbiddenException);
        });
    });
    describe("findAll", () => {
        it("should return paginated projects for user", async () => {
            const mockProjects = [mockProject];
            model.find.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockProjects),
            });
            model.countDocuments.mockReturnValue({
                exec: jest.fn().mockResolvedValue(1),
            });
            const result = await service.findAll("507f1f77bcf86cd799439011", {
                page: 1,
                limit: 10,
            });
            expect(result).toEqual({
                projects: mockProjects,
                total: 1,
                page: 1,
                limit: 10,
                totalPages: 1,
            });
        });
    });
});
//# sourceMappingURL=projects.service.spec.js.map