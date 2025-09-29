import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { NotFoundException, ForbiddenException } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { Project } from "./schemas/project.schema";

describe("ProjectsService", () => {
  let service: ProjectsService;
  let model: any;

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

  // Mock constructor for new this.projectModel()
  const MockModel = jest.fn().mockImplementation(() => mockProject);
  Object.assign(MockModel, mockModel);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getModelToken(Project.name),
          useValue: MockModel,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    model = module.get(getModelToken(Project.name));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a project successfully", async () => {
      const createProjectDto = {
        title: "Test Project",
        description: "Test Description",
        status: "active" as any,
      };

      mockProject.save.mockResolvedValue(mockProject);

      const result = await service.create(
        createProjectDto,
        "507f1f77bcf86cd799439011"
      );

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

      await expect(
        service.findOne("1", "507f1f77bcf86cd799439011")
      ).rejects.toThrow(NotFoundException);
    });

    it("should throw ForbiddenException if user does not own project", async () => {
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ ...mockProject, owner: "user2" }),
      });

      await expect(
        service.findOne("1", "507f1f77bcf86cd799439011")
      ).rejects.toThrow(ForbiddenException);
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
