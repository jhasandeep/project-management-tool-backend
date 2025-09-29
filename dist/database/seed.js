"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const users_service_1 = require("../users/users.service");
const projects_service_1 = require("../projects/projects.service");
const tasks_service_1 = require("../tasks/tasks.service");
const project_schema_1 = require("../projects/schemas/project.schema");
const task_schema_1 = require("../tasks/schemas/task.schema");
async function seed() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const usersService = app.get(users_service_1.UsersService);
    const projectsService = app.get(projects_service_1.ProjectsService);
    const tasksService = app.get(tasks_service_1.TasksService);
    try {
        console.log("🌱 Starting database seeding...");
        let testUser = await usersService.findByEmail("test@example.com");
        if (!testUser) {
            console.log("👤 Creating test user...");
            testUser = await usersService.create("test@example.com", "Test@123", "Test User");
            console.log("✅ Test user created");
        }
        else {
            console.log("👤 Test user already exists");
        }
        console.log("📁 Creating projects...");
        const project1 = await projectsService.create({
            title: "Website Redesign",
            description: "Complete redesign of the company website with modern UI/UX",
            status: project_schema_1.ProjectStatus.ACTIVE,
        }, testUser._id.toString());
        const project2 = await projectsService.create({
            title: "Mobile App Development",
            description: "Development of a new mobile application for iOS and Android",
            status: project_schema_1.ProjectStatus.ACTIVE,
        }, testUser._id.toString());
        console.log("✅ Projects created");
        console.log("📝 Creating tasks for Website Redesign...");
        await tasksService.create(project1._id.toString(), {
            title: "Design mockups",
            description: "Create wireframes and mockups for the new website design",
            status: task_schema_1.TaskStatus.DONE,
            dueDate: "2024-01-15",
        }, testUser._id.toString());
        await tasksService.create(project1._id.toString(), {
            title: "Frontend development",
            description: "Implement the frontend using React and TypeScript",
            status: task_schema_1.TaskStatus.IN_PROGRESS,
            dueDate: "2024-02-01",
        }, testUser._id.toString());
        await tasksService.create(project1._id.toString(), {
            title: "Backend API integration",
            description: "Connect frontend with backend APIs and implement data fetching",
            status: task_schema_1.TaskStatus.TODO,
            dueDate: "2024-02-15",
        }, testUser._id.toString());
        console.log("📝 Creating tasks for Mobile App Development...");
        await tasksService.create(project2._id.toString(), {
            title: "App architecture planning",
            description: "Plan the overall architecture and technology stack for the mobile app",
            status: task_schema_1.TaskStatus.DONE,
            dueDate: "2024-01-10",
        }, testUser._id.toString());
        await tasksService.create(project2._id.toString(), {
            title: "UI/UX design",
            description: "Design user interface and user experience for mobile screens",
            status: task_schema_1.TaskStatus.IN_PROGRESS,
            dueDate: "2024-01-25",
        }, testUser._id.toString());
        await tasksService.create(project2._id.toString(), {
            title: "Development setup",
            description: "Set up development environment and project structure",
            status: task_schema_1.TaskStatus.TODO,
            dueDate: "2024-02-05",
        }, testUser._id.toString());
        console.log("✅ Tasks created");
        console.log("🎉 Database seeding completed successfully!");
        console.log("");
        console.log("📋 Test credentials:");
        console.log("   Email: test@example.com");
        console.log("   Password: Test@123");
        console.log("");
        console.log("📊 Created data:");
        console.log("   - 1 test user");
        console.log("   - 2 projects");
        console.log("   - 6 tasks (3 per project)");
    }
    catch (error) {
        console.error("❌ Error during seeding:", error);
        throw error;
    }
    finally {
        await app.close();
    }
}
seed().catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map